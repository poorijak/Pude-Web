import type { PlacementCategory } from "@/types/assessment";

export const APP_NAME = "Pude";

export const NAV = {
  home: "หน้าหลัก",
  practice: "แบบฝึก",
  logout: "ออกจากระบบ",
} as const;

export const COMMON = {
  listen: "ฟังเสียง",
  listenAgain: "ฟังอีกครั้ง",
  next: "ข้อต่อไป",
  finish: "ดูผล",
  close: "ปิด",
  retry: "ลองอีกครั้ง",
  loading: "กำลังเตรียมข้อมูล...",
} as const;

export const ASSESSMENT = {
  introTitle: "มาลองดูกันนะคะ",
  introTiles: ["ฟัง", "ดูรูป", "พูด"],
  introListen: "ฟังคำอธิบาย",
  introSpeech:
    "เราจะให้คุณฟัง ดูรูป และพูดตาม ทั้งหมด 15 ข้อ ไม่มีถูกหรือผิด ทำเท่าที่ทำได้นะคะ",
  itemCount: "15 ข้อ",
  duration: "ประมาณ 5-7 นาที",
  start: "เริ่มเลย",
  progress: (current: number, total: number) => `ข้อ ${current} จาก ${total}`,
  micTitle: "อนุญาตให้เข้าถึงไมโครโฟน",
  micBodyLines: ["ระบบต้องใช้ไมโครโฟนเพื่อรับฟังคำตอบของคุณ", "โดยจะไม่มีการบันทึกเสียงไว้"],
  micAllow: "อนุญาต",
  micDeniedTitle: "ไม่สามารถเข้าถึงไมโครโฟนได้",
  micDeniedBodyLines: [
    "กรุณาเปิดสิทธิ์การใช้ไมโครโฟน",
    "ในการตั้งค่าเบราว์เซอร์ แล้วลองอีกครั้ง",
  ],
  micUnsupportedLines: ["อุปกรณ์นี้ยังไม่รองรับการอัดเสียง"],
  tapToSpeak: "แตะเพื่อพูด",
  tapToStop: "แตะเพื่อหยุด",
  caption: "แบบประเมินเบื้องต้น · ประมาณ 5-7 นาที",
  exitLabel: "ออกจากแบบประเมิน",
  exitTitle: "ออกจากแบบประเมินไหมคะ",
  exitBody: "คำตอบที่ทำไว้จะถูกเก็บไว้",
  exitContinue: "ทำต่อ",
  exitLeave: "ออก",
  heard: (text: string) => `ได้ยินว่า: ${text}`,
  stepperLabel: "ความคืบหน้า",
  categoryCount: (n: number) => `${n} ข้อ`,
  categoryProgress: (current: number, total: number) => `${current}/${total}`,
  recording: "กำลังฟังอยู่ค่ะ",
  processing: "กำลังฟังคำตอบ...",
  received: "รับคำตอบแล้วค่ะ",
  speakAgain: "พูดอีกครั้ง",
  notSure: "ไม่แน่ใจ",
  pickOne: "แตะรูปที่ใช่",
  chipsTitle: "ลองเลือกคำตอบที่ใกล้เคียงได้ค่ะ",
  imageMissing: "ยังไม่มีรูป",
  loadingResult: "กำลังดูผลให้นะคะ",
  resultTitle: (name: string) => `ทำได้ดีมากค่ะ คุณ${name}`,
  resultLevel: (level: number) => `เริ่มฝึกที่ ระดับ ${level}`,
  resultSpeech: (name: string, level: number) =>
    `ทำได้ดีมากค่ะ คุณ${name} เริ่มฝึกที่ระดับ ${level}`,
  resultDisclaimer:
    "ผลนี้ใช้เพื่อเลือกระดับแบบฝึกเท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์ค่ะ",
  lowComprehension:
    "ลองให้คนในครอบครัวช่วยฝึกไปด้วยกันนะคะ และควรปรึกษานักอรรถบำบัดเพื่อดูแลต่อเนื่องค่ะ",
  goHome: "ไปหน้าหลัก",
  saveError: "บันทึกผลยังไม่สำเร็จค่ะ ลองอีกครั้งนะคะ",
} as const;

export const CATEGORY_LABEL: Record<PlacementCategory, string> = {
  comprehension: "ฟังแล้วเลือกรูป",
  naming: "เรียกชื่อภาพ",
  word_clue: "ฟังคำใบ้",
  repeat: "พูดตาม",
  conversation: "ตอบคำถาม",
};

export const HOME = {
  hello: "สวัสดีค่ะ",
  mister: (name: string) => `คุณ${name}`,
  levelTitle: "ระดับของคุณ",
  levelStage: (level: number, stage: number) =>
    `ระดับ ${level} · ด่าน ${stage}/5`,
  toNext: (remaining: number, next: number) =>
    `ผ่านอีก ${remaining} ด่าน ไปต่อระดับ ${next}`,
  topLevel: "คุณอยู่ระดับสูงสุดแล้ว ฝึกต่อเพื่อให้คล่องขึ้นค่ะ",
  todayDone: (done: number, goal: number) =>
    `วันนี้ฝึกแล้ว ${done} จาก ${goal} ข้อ`,
  todayEmpty: "ยังไม่ได้ฝึก",
  todayEmptyHint: "เริ่มทีละข้อก็พอ",
  ready: "พร้อมฝึกต่อไหมคะ",
  readyLabel: "ฝึกต่อจากเดิม",
  goalHeroTitle: "วันนี้ครบเป้าแล้ว เก่งมากค่ะ",
  listenShort: "ฟัง",
  todayLabel: "วันนี้ฝึกแล้ว",
  todayCount: (done: number, goal: number) => `${done} จาก ${goal} ข้อ`,
  todayRemaining: (left: number) => `อีก ${left} ข้อครบเป้า`,
  todayGoalReached: "ครบเป้าแล้ว",
  readyDetail: (level: number, stage: number) =>
    `ระดับ ${level} · ด่าน ${stage} · ประมาณ 10 นาที`,
  start: "เริ่มฝึก",
  startMore: "ฝึกเพิ่ม",
  streakBadgeStart: "เริ่ม",
  streakDays: (n: number) => `ฝึกต่อเนื่อง ${n} วัน`,
  streakHint: (days: number, target: number) =>
    `อีก ${days} วัน ครบ ${target} วัน`,
  streakHintTop: "ฝึกต่อเนื่องได้ดีมากค่ะ",
  streakLegendPracticed: "ฝึกแล้ว",
  streakLegendToday: "วันนี้",
  weekDays: ["จ", "อ", "พ", "พฤ", "ศ", "ส", "อา"],
  milestoneTitle: (n: number) => `ครบ ${n} วันแล้ว!`,
  milestoneBody: "เก่งมากค่ะ ฝึกทุกวันเลย",
  milestoneContinue: "ฝึกต่อ",
  backTitle: "กลับมาฝึกด้วยกันนะ",
  backBody: "ไฟเริ่มใหม่ได้วันนี้",
  goalTitle: (goal: number) => `ครบ ${goal} ข้อแล้ว`,
  goalBody: "วันนี้เก่งมากค่ะ",
  goalRest: "พักได้เลย",
  errorTitle: "ยังโหลดข้อมูลไม่ได้ค่ะ",
  errorBody: "ไม่เป็นไรนะคะ ลองอีกครั้งได้เลย",
  greetingSpeech: (name: string, streak: number, done: number, goal: number) =>
    `สวัสดีค่ะ คุณ${name} ฝึกต่อเนื่อง ${streak} วัน วันนี้ฝึกแล้ว ${done} จาก ${goal} ข้อ`,
} as const;

export const PRACTICE = {
  title: "แบบฝึก",
  stub: (level: number, stage: number) =>
    `หน้าแบบฝึก ระดับ ${level} ด่าน ${stage} กำลังจะมาเร็วๆ นี้ค่ะ`,
} as const;
