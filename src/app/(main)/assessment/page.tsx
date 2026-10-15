import { redirect } from "next/navigation";
import { AssessmentFlow } from "@/feature/assessment/components/AssessmentFlow";
import { placementTestSchema } from "@/schemas/placement.schema";
import { getEntryPath } from "@/lib/routing";
import type { PlacementTest } from "@/types/assessment";
import type { User } from "@/types/user";

// MOCK DATA: delete when connecting the database
type MockState = "new-user" | "completed";
const MOCK_STATE = "new-user" as MockState;

const MOCK_USER: Pick<User, "name"> = { name: "สมชาย" };

const MOCK_TEST: PlacementTest = {
  id: "placement-v1",
  title: "แบบประเมินระดับเริ่มต้น",
  note: "ไม่มีถูกหรือผิด",
  max_score: 30,
  level_ranges: [
    { level: 1, min: 0, max: 11 },
    { level: 2, min: 12, max: 20 },
    { level: 3, min: 21, max: 30 },
  ],
  items: [
    {
      id: "pt-01",
      order: 1,
      category: "comprehension",
      instruction: "ฟังแล้วแตะรูปที่ได้ยิน",
      audio_text: "แมว",
      options: ["pn-l1-s1-03", "pn-l1-s1-04", "pn-l1-s1-05", "pn-l1-s1-06"],
      answer: "pn-l1-s1-03",
    },
    {
      id: "pt-02",
      order: 2,
      category: "comprehension",
      instruction: "ฟังแล้วแตะรูปที่ได้ยิน",
      audio_text: "ปลา",
      options: ["pn-l1-s1-07", "pn-l1-s1-08", "pn-l1-s1-09", "pn-l1-s1-10"],
      answer: "pn-l1-s1-08",
    },
    {
      id: "pt-03",
      order: 3,
      category: "comprehension",
      instruction: "ฟังแล้วแตะรูปที่ได้ยิน",
      audio_text: "รถ",
      options: ["pn-l1-s2-01", "pn-l1-s2-02", "pn-l1-s2-03", "pn-l1-s2-04"],
      answer: "pn-l1-s2-04",
    },
    {
      id: "pt-04",
      order: 4,
      category: "naming",
      instruction: "นี่คืออะไร",
      target_word: "แก้วน้ำ",
      accepted_answers: ["แก้ว", "แก้วน้ำ"],
      image_prompt: "แก้วน้ำใสวางบนโต๊ะ",
    },
    {
      id: "pt-05",
      order: 5,
      category: "naming",
      instruction: "นี่คืออะไร",
      target_word: "หมวก",
      accepted_answers: ["หมวก"],
      image_prompt: "หมวกใบเดียวบนพื้นขาว",
    },
    {
      id: "pt-06",
      order: 6,
      category: "naming",
      instruction: "นี่คืออะไร",
      target_word: "กุญแจ",
      accepted_answers: ["กุญแจ"],
      image_prompt: "กุญแจดอกเดียว",
    },
    {
      id: "pt-07",
      order: 7,
      category: "naming",
      instruction: "นี่คืออะไร",
      target_word: "ร่ม",
      accepted_answers: ["ร่ม"],
      image_prompt: "ร่มกางสีเรียบ",
    },
    {
      id: "pt-08",
      order: 8,
      category: "word_clue",
      instruction: "ฟังคำใบ้แล้วบอกว่าคืออะไร",
      clue: "ใช้ตักข้าวเข้าปาก",
      target_word: "ช้อน",
      accepted_answers: ["ช้อน"],
    },
    {
      id: "pt-09",
      order: 9,
      category: "word_clue",
      instruction: "ฟังคำใบ้แล้วบอกว่าคืออะไร",
      clue: "ใส่เท้าก่อนออกจากบ้าน",
      target_word: "รองเท้า",
      accepted_answers: ["รองเท้า"],
    },
    {
      id: "pt-10",
      order: 10,
      category: "word_clue",
      instruction: "ฟังคำใบ้แล้วบอกว่าคืออะไร",
      clue: "ใช้ดูเวลา",
      target_word: "นาฬิกา",
      accepted_answers: ["นาฬิกา"],
    },
    {
      id: "pt-11",
      order: 11,
      category: "repeat",
      instruction: "ฟังแล้วพูดตาม",
      phrase: "ฉันกินข้าว",
      key_words: ["ฉัน", "กิน", "ข้าว"],
    },
    {
      id: "pt-12",
      order: 12,
      category: "repeat",
      instruction: "ฟังแล้วพูดตาม",
      phrase: "วันนี้อากาศดี",
      key_words: ["วันนี้", "อากาศ", "ดี"],
    },
    {
      id: "pt-13",
      order: 13,
      category: "repeat",
      instruction: "ฟังแล้วพูดตาม",
      phrase: "ลูกสาวมาหาที่บ้าน",
      key_words: ["ลูกสาว", "มา", "บ้าน"],
    },
    {
      id: "pt-14",
      order: 14,
      category: "conversation",
      instruction: "ตอบคำถามตามที่อยากตอบ",
      question: "เช้านี้คุณกินอะไรคะ",
      expected_topic: "อาหารเช้า",
      example_answers: ["กินข้าวต้ม", "กินขนมปัง", "ดื่มกาแฟ"],
    },
    {
      id: "pt-15",
      order: 15,
      category: "conversation",
      instruction: "ตอบคำถามตามที่อยากตอบ",
      question: "วันนี้คุณรู้สึกอย่างไรบ้างคะ",
      expected_topic: "ความรู้สึก",
      example_answers: ["สบายดี", "เหนื่อยนิดหน่อย", "รู้สึกดี"],
    },
  ],
};

/** Image ids (options and pt-04..pt-07) mapped to URLs; null shows a placeholder. */
const MOCK_IMAGE_URLS: Record<string, string | null> = {};
// END MOCK DATA

export default function AssessmentPage() {
  if (MOCK_STATE === "completed") {
    redirect(getEntryPath(true));
  }

  const test = placementTestSchema.parse(MOCK_TEST);

  return (
    <AssessmentFlow
      test={test}
      userName={MOCK_USER.name}
      imageUrls={MOCK_IMAGE_URLS}
    />
  );
}
