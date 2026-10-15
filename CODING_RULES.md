# 📜 Frontend Coding Standards & Development Guide

เอกสารนี้รวบรวมมาตรฐานการเขียนโค้ด (Coding Rules), สถาปัตยกรรม (Architecture), รูปแบบการจัดการข้อมูล (State & Data Fetching), และข้อกำหนดในการพัฒนาสำหรับโปรเจกต์ Frontend (Next.js)

---

## 🏗️ Architecture & Tech Stack Overview

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + PostCSS + CSS Variables
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (สร้างบน Radix UI Primitives)
- **Data Fetching & Cache**: [TanStack Query v5](https://tanstack.com/query) (React Query)
- **Table Management**: [TanStack Table v8](https://tanstack.com/table) (`@tanstack/react-table`)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (`@hookform/resolvers/zod`)
- **HTTP Client**: [Axios](https://axios-http.com/) (`src/lib/axios.ts`) พร้อม Auto Token Refresh เมื่อเจอ 401
- **Icons**: Iconify (`@iconify/react`) และ Lucide React (`lucide-react`)
- **Notification**: [Sonner](https://sonner.emilkowal.ski/) (`toast`)
- **Route Guard**: Next.js `middleware.ts` ตรวจสอบ JWT Cookie (`accessToken`, `refreshToken`) ด้วย `jose`

---

## 📂 Project Structure (Feature-Driven Architecture)

โปรเจกต์จัดโครงสร้างแบบ **Feature-Driven Design** เพื่อแยกการทำงานตาม Domain ของแต่ละฟังก์ชัน:

```text
src/
├── app/                      # Next.js App Router (Routes & Layouts)
│   ├── (auth)/auth/          # หน้า Authentication (Login, Signin, Callback)
│   ├── (main)/               # หน้าหลักของผู้ใช้งานทั่วไป (General User)
│   └── admin/                # หน้าแดชบอร์ดและการจัดการของผู้ดูแลระบบ (Admin)
├── feature/                  # โฟลเดอร์ของแต่ละ Feature (หัวใจหลักของ Business Logic)
│   ├── <feature-name>/       # เช่น users, products, categories, profile
│   │   ├── components/       # UI Components เฉพาะของ Feature นั้น (List, Modal, Card, Table)
│   │   ├── hooks/            # useQuery (Read data) และ Custom State Hooks
│   │   └── server/           # useMutation (Write/Update/Delete data & Optimistic Updates)
│   └── admin/                # Features เฉพาะฝั่ง Admin
│       ├── <feature-name>/
│       └── ...
├── components/
│   ├── ui/                   # Base UI Components จาก Shadcn (Button, Card, Table, Dialog, Input)
│   └── shared/               # Reusable Components กลาง (DataTable, FormInput, Modal, StatusBadge)
├── schemas/                  # Zod Schemas สำหรับ Form Validation (สอดคล้องกับ API/Backend)
├── types/                    # TypeScript Types, Interfaces, และ Enums
├── lib/                      # Utilities (`utils.ts` สำหรับ `cn()`, `axios.ts`)
├── provider/                 # Context Providers (QueryProvider, ThemeProvider)
└── middleware.ts             # Auth Guard ตรวจจับ Role และการเข้าถึงหน้าเว็บตามสิทธิ์
```

---

## 🎯 กฎสำคัญในการเขียนโค้ด (Frontend Coding Rules)

### 1. การแบ่งแยก `hooks/` และ `server/` ใน Feature
เพื่อความเป็นระเบียบและสอดคล้องกันทั้งโปรเจกต์:
- **`hooks/`**: ใช้สำหรับ **ดึงข้อมูล (Read Data)** ด้วย `useQuery` เท่านั้น เช่น:
  - `useGet<Feature>List.ts` (เช่น `useGetItems`)
  - `useGet<Feature>ById.ts` (เช่น `useGetItemById`)
  - `useGetCategories.ts`
- **`server/`**: ใช้สำหรับ **แก้ไขข้อมูล (Mutation / Write / Delete)** ด้วย `useMutation` เท่านั้น เช่น:
  - `useCreate<Feature>.ts` (เช่น `useCreateItem`)
  - `useUpdate<Feature>.ts` (เช่น `useUpdateItem`)
  - `useDelete<Feature>.ts` (เช่น `useDeleteItem`)
  - `useUpdateStatus.ts`

### 2. การจัดการ Query Key ใน TanStack Query
- ตั้งชื่อ Query Key ให้เป็นมาตรฐานและระบุพารามิเตอร์ที่ใช้เป็นตัวกรองอย่างชัดเจน:
  - รายการ (List): `["<resource>", page, filter, search]`
  - หมวดหมู่ / ตัวเลือก (Options): `["<resource>", "categories"]` หรือ `["categories"]`
  - รายละเอียดเดี่ยว (Detail): `["<resource>", id]`
- **Sub-item หรือ Nested Resource**: ให้ผูก Query Key เข้ากับ Resource หลัก (เช่น `["<resource>"]`) เพื่อให้การ Invalidate ข้อมูลทำงานครอบคลุมสอดคล้องกัน

### 3. การทำ Optimistic Update อย่างถูกต้อง
เมื่อต้องการให้ UI ตอบสนองทันที (0 วินาที) ก่อนที่ API จะตอบกลับ:
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

interface UpdateStatusPayload {
  id: string;
  status: string;
}

export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateStatusPayload) => {
      const { data } = await api.patch(`/items/${id}/status`, { status });
      return data;
    },
    // 1. Snapshot ข้อมูลเดิม และแก้ไข Cache ล่วงหน้าทันที
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
      const prevData = queryClient.getQueriesData({ queryKey: ["items"] });

      queryClient.setQueriesData({ queryKey: ["items"] }, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((item: any) =>
            item.id === variables.id ? { ...item, status: variables.status } : item
          ),
        };
      });

      return { prevData };
    },
    // 2. Rollback ข้อมูลกลับ หากฝั่งเซิร์ฟเวอร์เกิด Error
    onError: (err: any, _variables, context) => {
      if (context?.prevData) {
        context.prevData.forEach(([key, old]) => queryClient.setQueryData(key, old));
      }
      toast.error(err?.response?.data?.message || err.message || "เกิดข้อผิดพลาดในการอัปเดต");
    },
    // 3. Invalidate ข้อมูลที่เกี่ยวข้องเมื่อเสร็จสิ้นเพื่อซิงค์ข้อมูลล่าสุด
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};
```

### 4. การจัดการ Form & Validation
- ฟอร์มทุกตัวต้องใช้ **React Hook Form** ร่วมกับ **Zod Resolver** (`@hookform/resolvers/zod`)
- Zod Schema ต้องวางไว้ที่ `src/schemas/<feature>.schema.ts` เสมอ ห้ามเขียน inline ใน Component
- ข้อความแจ้งเตือน Validation (Zod Message) ต้องเป็นภาษาไทยที่สุภาพและเข้าใจง่าย

### 5. URL Search Params สำหรับ Table State (Filters & Pagination)
- ข้อมูลสถานะของตาราง เช่น **Page, Search, Category Filter, Sort** ต้องซิงค์กับ **URL Search Params** เสมอ
- ข้อดี: ผู้ใช้สามารถ Copy Link, กด Refresh, หรือกดปุ่ม Back ของเบราว์เซอร์ แล้วข้อมูลยังคงอยู่หน้าเดิม
- ใช้ `useSearchParams()`, `usePathname()`, และ `router.push()`

### 6. การจัดการ HTTP Client (Axios)
- เรียก API ผ่าน `api` จาก `@/lib/axios` เสมอ (ห้ามใช้ `fetch` หรือสร้าง `axios.create` ซ้ำซ้อน)
- ตัว `api` ใน `axios.ts` มี Interceptor ที่จัดการ Refresh Token ให้อัตโนมัติเมื่อเจอรหัส 401
- ใน Client Component เส้นทาง API จะถูก Rewrite ผ่าน Next.js Proxy (`/api/...`) อัตโนมัติ

### 7. Styling & ClassName Convention
- ใช้ Tailwind CSS ผ่านฟังก์ชัน `cn(...)` จาก `@/lib/utils` เสมอ เพื่อ Merge Class และแก้ปัญหา Class ทับซ้อน
- ห้ามเขียน Inline Style ยกเว้นเป็น Dynamic Style ที่กำหนดค่าสีเฉพาะเจาะจงมาจาก Config (เช่น สีพื้นหลังของ Status Badge)
- รองรับ Responsive Design (Mobile-First หรือ Breakpoints `sm:`, `md:`, `lg:`)

### 8. TypeScript & Strict Typing
- ห้ามใช้ `any` ในจุดที่ไม่จำเป็น ให้สร้าง Type/Interface ไว้ที่ `src/types/`
- ใช้ Path Alias `@/...` สำหรับทุกการ Import จาก `src/` เสมอ (ห้ามใช้ Relative Path ถอยหลังยาวๆ เช่น `../../../../`)

### 9. การติดตั้ง Package ใหม่ในโหมด Docker Development (Docker Package Sync)
- **ปัญหา**: Docker Compose มีการ Mount Anonymous Volume สำหรับ `/app/node_modules` เพื่อแยก Environment
- **ข้อปฏิบัติสำคัญ**: เมื่อใดก็ตามที่มีการติดตั้ง Dependency ใหม่บนเครื่อง Host เช่น `npm i <package>`, `npm i -D <package>` หรือรัน CLI อย่าง `npx shadcn add ...` **ต้องรัน `npm install` เข้าไปใน Docker Container เสมอ** เพื่อให้อัปเดต `node_modules` ภายใน Container:
  ```bash
  # รันคำสั่ง npm install เข้าไปใน container ที่กำลังทำงานอยู่
  docker exec <container-name> npm install

  # ตัวอย่างสำหรับ pude-web (Frontend):
  docker exec pude-web npm install

  # ตัวอย่างสำหรับ pude-api (Backend):
  docker exec pude-api npm install
  ```
- **ทางเลือกในการ Rebuild แบบ Recreate Volume**: หากต้องการ Rebuild Container ใหม่ทั้งหมด ให้ใส่ Flag `-V` เพื่อเคลียร์ Anonymous Volume เก่าเสมอ:
  ```bash
  docker compose -f docker-compose.dev.yaml up -d --build -V
  ```

---

## 📋 Checklist เมื่อสร้าง Feature ใหม่ใน Frontend

1. [ ] กำหนด Type / Interface ใน `src/types/<feature>.ts`
2. [ ] สร้าง Zod Schema ใน `src/schemas/<feature>.schema.ts`
3. [ ] สร้าง API Hook:
   - Read ➡️ `src/feature/<feature>/hooks/use<Feature>.ts`
   - Mutation ➡️ `src/feature/<feature>/server/<feature>.ts`
4. [ ] สร้าง UI Component ใน `src/feature/<feature>/components/`
5. [ ] ประกอบหน้าใน `src/app/.../page.tsx`
6. [ ] หากมีการติดตั้ง Library/Package ใหม่: รัน `docker exec <container-name> npm install` ให้เรียบร้อย
7. [ ] ตรวจสอบ Error Handling และแจ้งเตือนด้วย `toast` จาก Sonner
8. [ ] รัน `npm run lint` และ `npm run check-types` เพื่อตรวจสอบความถูกต้อง
