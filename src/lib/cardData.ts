// Card Data for Egg Game Collection System
// Theme: "นักเรียนคนหนึ่งพยายามสอบเข้ามหาวิทยาลัยในฝัน"

export type EggColor = "red" | "blue" | "green" | "yellow" | "gray";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface CardStats {
  mind: number; // 🧠 ปัญญา - ความเข้าใจ การจำ การคิดวิเคราะห์
  body: number; // 💪 ร่างกาย - ความแข็งแกร่ง ความอดทน สุขภาพ
  spirit: number; // 🍀 ใจ - โชค กำลังใจ ความมุ่งมั่น
}

export interface Card {
  id: string; // "#001" - "#040"
  emoji: string;
  color: EggColor;
  nameTH: string;
  nameEN: string;
  stats: CardStats;
  rarity: Rarity;
  lore: string[];
  ability: string; // คำอธิบายพลัง
}

export interface CardCollection {
  red: Record<string, number>;
  blue: Record<string, number>;
  green: Record<string, number>;
  yellow: Record<string, number>;
  gray: Record<string, number>;
}

// ============================================================
// LEVEL6_EMOJI_SETS - 5 Sets × 8 Emojis = 40 Cards
// ============================================================

export const LEVEL6_EMOJI_SETS: Record<EggColor, string[]> = {
  red: ["👮", "👷", "👨‍🌾", "👨‍🍳", "👨‍⚕️", "👨‍🏫", "👨‍💻", "👨‍🔧"], // People/Jobs
  blue: ["🍔", "🍕", "🍜", "🍣", "🍦", "🍩", "🍰", "🧁"], // Food
  green: ["🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"], // Animals
  yellow: ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝"], // Fruits
  gray: ["☀️", "🌧️", "⛈️", "❄️", "🌦️️", "☃️", "🌖", "⛅️"], // Weather
};

// ============================================================
// ALL_CARDS - 40 Cards with full data
// ============================================================

// RED SET (#001-#008) - People/Jobs
const RED_CARDS: Card[] = [
  {
    id: "#001",
    emoji: "👮",
    color: "red",
    nameTH: "พี่ตำรวจ",
    nameEN: "Dream Protector",
    stats: { mind: 25, body: 40, spirit: 35 },
    rarity: "common",
    lore: [
      "พี่ตำรวจผู้ภักดี",
      "คอยคุ้มครองน้องๆ ผู้มีฝัน",
      "ไม่ให้ใครมาขโมยความฝัน",
      "และตั้งใจของน้องๆ ไป",
      '"พี่จะปกป้องฝันของน้อง"',
    ],
    ability: "ปกป้องความมุ่งมั่น ลดโอกาสหงุดหงิด 25%",
  },
  {
    id: "#002",
    emoji: "👷",
    color: "red",
    nameTH: "ช่างก่อสร้างฝัน",
    nameEN: "Dream Builder",
    stats: { mind: 35, body: 50, spirit: 30 },
    rarity: "uncommon",
    lore: [
      "ช่างผู้สร้างฐานรากที่แข็งแรง",
      "เคยช่วยนักเรียนผู้หนึ่ง",
      "สร้างพื้นฐานความรู้จนสอบได้",
      '"รากที่ดี ต้นจะแข็งแรง"',
    ],
    ability: "สร้างพื้นฐานความรู้ จำสูตรพื้นฐานได้นานขึ้น",
  },
  {
    id: "#003",
    emoji: "👨‍🌾",
    color: "red",
    nameTH: "ชาวนาแห่งความรู้",
    nameEN: "Knowledge Farmer",
    stats: { mind: 40, body: 55, spirit: 35 },
    rarity: "uncommon",
    lore: [
      "ชาวนาผู้ปลูกต้นไม้แห่งปัญญา",
      "บอกว่าความรู้เหมือนการเกษตร",
      "ต้องดูแลทุกวัน อดทนต่อแดดร้อน",
      '"วันหนึ่นจะได้เก็บเกี่ยวผล"',
    ],
    ability: "เพิ่มความอดทน อ่านหนังสือได้นานขึ้น 45 นาที",
  },
  {
    id: "#004",
    emoji: "👨‍🍳",
    color: "red",
    nameTH: "เชฟแห่งสูตรความจำ",
    nameEN: "Memory Chef",
    stats: { mind: 45, body: 35, spirit: 45 },
    rarity: "rare",
    lore: [
      "เชฟผู้ผสมผสานวัตถุดิบแห่งความรู้",
      "บอกว่าการเรียนเหมือนการทำอาหาร",
      "ต้องผสมสูตรให้ถูกต้อง",
      '"สูตรที่ดี รสจะอร่อย"',
    ],
    ability: "ช่วยจำสูตรและวิธีทำ สามารถนำไปใช้ได้ทันที",
  },
  {
    id: "#005",
    emoji: "👨‍⚕️",
    color: "red",
    nameTH: "หมอบำบัดความเหนื่อยล้า",
    nameEN: "Fatigue Healer",
    stats: { mind: 50, body: 60, spirit: 40 },
    rarity: "rare",
    lore: [
      "หมอผู้รักษาอาการเพลียจากการอ่าน",
      "มียาวิเศษชนิดหนึ่ง",
      "ทำให้นักเรียนกลับมาสดชื่น",
      '"พักสมองเพื่อวิ่งต่อ"',
    ],
    ability: "บำบัดความเหนื่อยล้า ลดเวลาพัก เพิ่มเวลาอ่านได้ 1 ชั่วโมง",
  },
  {
    id: "#006",
    emoji: "👨‍🏫",
    color: "red",
    nameTH: "อาจารย์ผู้ให้กำลังใจ",
    nameEN: "Inspiring Teacher",
    stats: { mind: 55, body: 45, spirit: 70 },
    rarity: "epic",
    lore: [
      "อาจารย์ผู้เห็นศักยภาพในตัวนักเรียน",
      "มักจะปรากฏตัวเมื่อใครสิ้นหวัง",
      '"เธอทำได้แน่นอน"',
      '"ความพ่ายแพ้คือจุดเริ่มต้นของชัยชนะ"',
    ],
    ability: "ให้กำลังใจ เพิ่มความมั่นใจ ลดความเครียดก่อนสอบ 50%",
  },
  {
    id: "#007",
    emoji: "👨‍💻",
    color: "red",
    nameTH: "โปรแกรมเมอร์แห่งตรรกะ",
    nameEN: "Logic Programmer",
    stats: { mind: 70, body: 40, spirit: 50 },
    rarity: "epic",
    lore: [
      "โปรแกรมเมอร์ผู้เขียนโค้ดแห่งชีวิต",
      "สอนให้คิดเป็นขั้นตอน",
      "แก้ปัญหาด้วยตรรกะ",
      '"ทุกปัญหามี solution เสมอ"',
    ],
    ability: "เพิ่มทักษะคิดวิเคราะห์ แก้โจทย์ยากได้เร็วขึ้น 40%",
  },
  {
    id: "#008",
    emoji: "👨‍🔧",
    color: "red",
    nameTH: "ช่างซ่อมแซมหลุมพลาด",
    nameEN: "Mistake Mechanic",
    stats: { mind: 65, body: 50, spirit: 45 },
    rarity: "epic",
    lore: [
      "ช่างผู้ชื่นชอบการซ่อมสิ่งที่เสียหาย",
      "บอกว่าความผิดพลาดคือโอกาสเรียนรู้",
      '"ซ่อมให้ดีกว่าเดิม"',
      '"ทำใหม่จนถูกต้อง"',
    ],
    ability: "ช่วยแก้ไขความผิดพลาด ทำซ้ำจนจำได้แม่นยำ",
  },
];

// BLUE SET (#009-#016) - Food
const BLUE_CARDS: Card[] = [
  {
    id: "#009",
    emoji: "🍔",
    color: "blue",
    nameTH: "เบอร์เกอร์พลัง",
    nameEN: "Power Burger",
    stats: { mind: 20, body: 35, spirit: 30 },
    rarity: "common",
    lore: [
      "เบอร์เกอร์ที่นักเรียนทำขาด",
      "กินแล้วมีแรงต่อไป",
      '"เติมพลังให้สมอง"',
    ],
    ability: "เพิ่มพลังความอดทน อดทนต่อความหิวได้นานขึ้น",
  },
  {
    id: "#010",
    emoji: "🍕",
    color: "blue",
    nameTH: "พิซซ่าแห่งความสุข",
    nameEN: "Happiness Pizza",
    stats: { mind: 25, body: 30, spirit: 50 },
    rarity: "common",
    lore: [
      "พิซซ่าที่แบ่งปันความสุข",
      "ทำให้อ่านหนังสือเพลิดเพลิน",
      '"เรียนเป็น เล่นก็เป็น"',
    ],
    ability: "เพิ่มความสุขในการเรียน อ่านได้นานขึ้นโดยไม่เบื่อ",
  },
  {
    id: "#011",
    emoji: "🍜",
    color: "blue",
    nameTH: "บะหมี่กึ่งสำเร็จแห่งการทบทวน",
    nameEN: "Review Noodle",
    stats: { mind: 40, body: 35, spirit: 35 },
    rarity: "uncommon",
    lore: [
      "บะหมี่ที่ช่วยทบทวนบทเรียน",
      "เส้นบะหมี่แทนความเชื่อมโยง",
      '"ทบทวนไป เรียนรู้ไป"',
    ],
    ability: "ช่วยทบทวนบทเรียน จำเนื้อหาได้ดีขึ้น 30%",
  },
  {
    id: "#012",
    emoji: "🍣",
    color: "blue",
    nameTH: "ซูชิแห่งความเรียบเรียง",
    nameEN: "Organized Sushi",
    stats: { mind: 50, body: 30, spirit: 40 },
    rarity: "rare",
    lore: [
      "ซูชิที่เรียงงามเป็นระเบียบ",
      "สอนให้รู้จักการจัดระเบียบ",
      '"เรียบเรียงความคิด เรียบเรียงชีวิต"',
    ],
    ability: "ช่วยจัดระเบียบความคิด เขียนคำตอบเป็นระเบียบ",
  },
  {
    id: "#013",
    emoji: "🍦",
    color: "blue",
    nameTH: "ไอศกรีมเย็นใจ",
    nameEN: "Cool Mind Ice Cream",
    stats: { mind: 35, body: 25, spirit: 55 },
    rarity: "uncommon",
    lore: [
      "ไอศกรีมที่เย็นสมอง",
      "ช่วยให้คิดเย็นๆ เวลาทำข้อสอบ",
      '"เย็นใจ เข้มแข็ง"',
    ],
    ability: "สงบสมอง ลดความตึงเครียด เวลาทำข้อสอบได้ดีขึ้น",
  },
  {
    id: "#014",
    emoji: "🍩",
    color: "blue",
    nameTH: "โดนัทแหวนแห่งสมาธิ",
    nameEN: "Focus Donut",
    stats: { mind: 55, body: 30, spirit: 40 },
    rarity: "rare",
    lore: [
      "โดนัทรูปกลมวงกลม",
      "เหมือนสมาธิที่ไม่หลุดวง",
      '"มองแต่ในรู ไม่มีสิ่งรบกวน"',
    ],
    ability: "เพิ่มสมาธิระดับสูง อ่านต่อเนื่องได้ 60 นาที",
  },
  {
    id: "#015",
    emoji: "🍰",
    color: "blue",
    nameTH: "เค้กแห่งการเฉลิมฉลอง",
    nameEN: "Celebration Cake",
    stats: { mind: 45, body: 40, spirit: 65 },
    rarity: "epic",
    lore: [
      "เค้กที่เฉลิมฉลองความสำเร็จ",
      "ทุกครั้งที่ผ่านด่าน",
      "จะได้ทานเค้กชิ้นนี้",
      '"เฉลิมฉลองทุกความสำเร็จ"',
    ],
    ability: "เฉลิมฉลองความสำเร็จ เพิ่มความมั่นใจ โชคดีในการสอบ",
  },
  {
    id: "#016",
    emoji: "🧁",
    color: "blue",
    nameTH: "คัพเค้กนำโชค",
    nameEN: "Lucky Cupcake",
    stats: { mind: 30, body: 25, spirit: 75 },
    rarity: "epic",
    lore: [
      "คัพเค้กตัวน้อยที่มาพร้อมโชค",
      "ใครทานจะเจอเรื่องดี",
      '"โชคจะมาเมื่อเตรียมพร้อม"',
    ],
    ability: "เพิ่มโชคลาภ เจอข้อสอบที่ถนัด 50%",
  },
];

// GREEN SET (#017-#024) - Animals
const GREEN_CARDS: Card[] = [
  {
    id: "#017",
    emoji: "🐱",
    color: "green",
    nameTH: "เจ้าเหมียวนำโชค",
    nameEN: "Lucky Cat",
    stats: { mind: 40, body: 35, spirit: 70 },
    rarity: "rare",
    lore: [
      "แมวที่ช่วยนักเรียนผ่าน",
      "ช่วงเวลายากลำบากที่สุด",
      "เมื่อนักเรียนกำลังจะท้อ",
      "เจ้าเหมียวปรากฏตัวขึ้น",
      '"เธอจะผ่านไปได้แน่นอน"',
    ],
    ability: "เจอข้อสอบที่ถนัด โชคดีในการสอบ",
  },
  {
    id: "#018",
    emoji: "🐶",
    color: "green",
    nameTH: "เพื่อนตรึ้จซื่อสัตย์",
    nameEN: "Loyal Friend",
    stats: { mind: 35, body: 45, spirit: 45 },
    rarity: "uncommon",
    lore: [
      "เพื่อนตัวน้อยที่อยู่ข้างกาย",
      "เวลาอ่านหนังสองไม่เหงา",
      '"มิตรภาพคือยาพิ้ำธรรมชาติ"',
    ],
    ability: "ลดความเหงาจากการอ่านโดดลำพัง เพิ่มความมุ่งมั่น",
  },
  {
    id: "#019",
    emoji: "🐰",
    color: "green",
    nameTH: "กระต่ายกระโดดความรู้",
    nameEN: "Knowledge Rabbit",
    stats: { mind: 45, body: 30, spirit: 55 },
    rarity: "rare",
    lore: [
      "กระต่ายกระโดดไปมา",
      "เรียนรู้อะไรไวมาก",
      '"กระโดดข้ามความยากลำบาก"',
    ],
    ability: "เรียนรู้เร็ว จำเนื้อหาใหม่ได้เร็ว 40%",
  },
  {
    id: "#020",
    emoji: "🦊",
    color: "green",
    nameTH: "สุนัขจิ้งจอกแห่งปัญญา",
    nameEN: "Wisdom Fox",
    stats: { mind: 60, body: 35, spirit: 50 },
    rarity: "epic",
    lore: [
      "สุนัขจิ้งจอกผู้มีปัญญา",
      "สอนให้คิดหลากหลาย",
      "มองเห็นสิ่งที่คนมองไม่เห็น",
      '"ปัญญาอยู่ที่ไหน ก็เอามาได้"',
    ],
    ability: "เพิ่มทักษะคิดวิเคราะห์ แก้โจทย์ปัญหาได้อย่างชาญฉลาด",
  },
  {
    id: "#021",
    emoji: "🐻",
    color: "green",
    nameTH: "หมีพันธุ์แกร่ง",
    nameEN: "Strong Bear",
    stats: { mind: 40, body: 70, spirit: 35 },
    rarity: "rare",
    lore: ["หมีผู้แข็งแกร่ง", "ทนทานต่อทุกสิ่ง", '"ความแข็งแกร่งคนละครึ่ง"'],
    ability: "เพิ่มความแข็งแกร่ง อ่านได้นานมาก โดยไม่เพลีย",
  },
  {
    id: "#022",
    emoji: "🐼",
    color: "green",
    nameTH: "แพนด้าสงบสติอารมณ์",
    nameEN: "Calm Panda",
    stats: { mind: 50, body: 40, spirit: 45 },
    rarity: "rare",
    lore: [
      "แพนด้าที่กินแต่ใบไผ่",
      "สอนให้สุขุม นิ่ง สงบ",
      '"สงบเป็น สุขุมเป็น"',
    ],
    ability: "สงบสติอารมณ์ ลดความตึงเครียด สอบได้ดีขึ้น",
  },
  {
    id: "#023",
    emoji: "🐨",
    color: "green",
    nameTH: "โคอาล่าหลับในความรู้",
    nameEN: "Knowledge Sleeper",
    stats: { mind: 55, body: 55, spirit: 40 },
    rarity: "epic",
    lore: [
      "โคอาล่าที่หลับตลอดเวลา",
      "แต่เวลาตื่นก็จำได้ทุกอย่าง",
      '"บางครั้ง การพักก็คือการเรียน"',
    ],
    ability: "เรียนรู้ขณะหลับ จำเนื้อหาได้ดีขึ้นจากการพักผ่อน",
  },
  {
    id: "#024",
    emoji: "🐯",
    color: "green",
    nameTH: "เสือนักสู้",
    nameEN: "Fighting Tiger",
    stats: { mind: 65, body: 50, spirit: 60 },
    rarity: "epic",
    lore: [
      "เสือผู้ไม่ยอมแพ้",
      "สอนให้ต่อสู้กับความยากลำบาก",
      '"นักสู้ตัวจริง ไม่ยอมแพ้"',
    ],
    ability: "เพิ่มความมุ่งมั่น ฝ่าฟันอุปสรรค ทำข้อสอบยากให้ได้",
  },
];

// YELLOW SET (#025-#032) - Fruits
const YELLOW_CARDS: Card[] = [
  {
    id: "#025",
    emoji: "🍎",
    color: "yellow",
    nameTH: "ส้มสมบูรณ์",
    nameEN: "Mandarin of Focus",
    stats: { mind: 45, body: 30, spirit: 35 },
    rarity: "rare",
    lore: [
      "ในคืนที่นักเรียนนั่งอ่านหนังสือจนดึก",
      "รู้สึกหมดแรงและเริ่มจะนอนหลับ...",
      "ส้มลูกนี้ปรากฏกายขึ้น",
      '"ทานเพียงลูกเดียว สมาธิจะกลับมา"',
    ],
    ability: "ช่วยให้สมาธิดีขึ้น อ่านหนังสือได้นานขึ้น 30 นาที",
  },
  {
    id: "#026",
    emoji: "🍊",
    color: "yellow",
    nameTH: "ส้มโอสดชื่น",
    nameEN: "Refreshing Pomelo",
    stats: { mind: 35, body: 40, spirit: 40 },
    rarity: "uncommon",
    lore: ["ส้มโอที่สดชื่น", "กินแล้วตื่นขึ้น", '"สดชื่น พร้อมเรียน"'],
    ability: "ตื่นตา ตื่นใจ อ่านหนังสือได้ต่อเนื่อง",
  },
  {
    id: "#027",
    emoji: "🍋",
    color: "yellow",
    nameTH: "มะนาวกระตุ้นพลัง",
    nameEN: "Energy Lemon",
    stats: { mind: 30, body: 35, spirit: 50 },
    rarity: "uncommon",
    lore: ["มะนาวที่กระตุ้นพลัง", "เปรี้ยวแต่ดี", '"กระตุ้นสมองให้ทำงาน"'],
    ability: "กระตุ้นพลัง ทำข้อสอบได้เร็วขึ้น",
  },
  {
    id: "#028",
    emoji: "🍇",
    color: "yellow",
    nameTH: "องุ่นแห่งความจำ",
    nameEN: "Memory Grape",
    stats: { mind: 55, body: 35, spirit: 40 },
    rarity: "rare",
    lore: ["องุ่นที่ช่วยจำ", "ทานทีละเม็็ด", '"จำทีละเรื่อง ได้ทุกเรื่อง"'],
    ability: "ช่วยให้จำได้ดีขึ้น จำเนื้อหาได้นาน",
  },
  {
    id: "#029",
    emoji: "🍓",
    color: "yellow",
    nameTH: "สตรอว์เบอร์รี่แห่งความใส",
    nameEN: "Clarity Strawberry",
    stats: { mind: 60, body: 30, spirit: 50 },
    rarity: "epic",
    lore: [
      "สตรอว์เบอร์รี่ที่ใสสะอาด",
      "ช่วยให้ความคิดชัดเจน",
      '"ความใส คือ ความรู้"',
    ],
    ability: "ทำให้ความคิดชัดเจน เข้าใจโจทย์ได้ง่ายขึ้น",
  },
  {
    id: "#030",
    emoji: "🍑",
    color: "yellow",
    nameTH: "ท้อเปิดนำโชค",
    nameEN: "Lucky Peach",
    stats: { mind: 40, body: 35, spirit: 60 },
    rarity: "rare",
    lore: ["ลูกท้อที่เปิดออก", "ภายในคือโชค", '"เปิดใจ รับโชค"'],
    ability: "เปิดโอกาสใหม่ โชคดีในการสอบ",
  },
  {
    id: "#031",
    emoji: "🍒",
    color: "yellow",
    nameTH: "เชอร์รี่คู่แห่งความสำเร็จ",
    nameEN: "Success Cherry",
    stats: { mind: 50, body: 40, spirit: 55 },
    rarity: "epic",
    lore: [
      "เชอร์รี่สองลูกคู่กัน",
      "เหมือนความสำเร็จที่มาคู่",
      '"สำเร็จคู่ ใช่ดับคู่"',
    ],
    ability: "เพิ่มโอกาสความสำเร็จ ผ่านการสอบได้ดี",
  },
  {
    id: "#032",
    emoji: "🥝",
    color: "yellow",
    nameTH: "เมืองทองแห่งความจำ",
    nameEN: "Golden Kiwi of Memory",
    stats: { mind: 99, body: 95, spirit: 88 },
    rarity: "legendary",
    lore: [
      "ในตำนานเล่าว่า ผู้ที่ได้กินเมืองทองนี้",
      "จะจำได้ทุกสิ่งที่เคยอ่าน",
      "นักเรียนผู้หนึ่งใช้มาสอบเข้ามหาวิทยาลัย",
      "และได้คะแนนเต็ม... ตั้งแต่นั้นมา",
      "ไม่มีใครเคยเห็นเมืองทองลูกนั้นอีกเลย",
    ],
    ability: "จำได้ทุกสิ่งที่อ่าน ความจำอมตะ นาน 24 ชั่วโมง",
  },
];

// GRAY SET (#033-#040) - Weather
const GRAY_CARDS: Card[] = [
  {
    id: "#033",
    emoji: "☀️",
    color: "gray",
    nameTH: "ดวงอาทิตย์แห่งปัญญา",
    nameEN: "Sun of Wisdom",
    stats: { mind: 99, body: 95, spirit: 95 },
    rarity: "legendary",
    lore: [
      '"ในวันที่มืดมนที่สุด',
      "ดวงอาทิตย์ลูกนี้ลงมา",
      "มอบแสงสว่างให้ผู้ที่ศรัทธา",
      "นักเรียนผู้นั้นได้กลายเป็น",
      'ผู้สอบผ่านที่ยิ่งใหญ่ที่สุด"',
    ],
    ability: "สว่างไสว ความจำอมตะ โชคชะตา ครองความสำเร็จ",
  },
  {
    id: "#034",
    emoji: "🌧️",
    color: "gray",
    nameTH: "ฝนแห่งการเรียนรู้",
    nameEN: "Learning Rain",
    stats: { mind: 50, body: 60, spirit: 40 },
    rarity: "rare",
    lore: [
      "ฝนที่ตกลงมาอย่างสม่ำเสมอ",
      "ช่วยให้ต้นไม้แห่งความรู้เติบโต",
      '"ฝนตก ต้นไม้เติบโต"',
    ],
    ability: "สม่ำเสมอ อ่านหนังสือเป็นประจำ เรียนรู้ได้ทุกวัน",
  },
  {
    id: "#035",
    emoji: "⛈️",
    color: "gray",
    nameTH: "พายุฟ้าคะนองแห่งความรู้",
    nameEN: "Knowledge Thunder",
    stats: { mind: 70, body: 45, spirit: 55 },
    rarity: "epic",
    lore: [
      "พายุที่พัดผ่าน",
      "พาความรู้มาสู่ผู้ที่รอคอย",
      '"พายุผ่านไป ความรู้ยังคง"',
    ],
    ability: "ความรู้เข้าถึงเร็ว จำเนื้อหาได้ทันที",
  },
  {
    id: "#036",
    emoji: "❄️",
    color: "gray",
    nameTH: "หิมะเยือกแข็งแห่งสมาธิ",
    nameEN: "Focus Ice",
    stats: { mind: 85, body: 40, spirit: 50 },
    rarity: "epic",
    lore: ["หิมะที่เยือกแข็ง", "สอนให้สงบนิ่ง", '"เยือกแข็ง เป็นระเบียบ"'],
    ability: "สงบสติอารมณ์ระดับสูง สมาธิแม่นยำ ลดความกลัว",
  },
  {
    id: "#037",
    emoji: "🌦️️",
    color: "gray",
    nameTH: "ฝนสาดแดดส่องแห่งความหวัง",
    nameEN: "Hope Weather",
    stats: { mind: 45, body: 35, spirit: 70 },
    rarity: "rare",
    lore: [
      "ฝนสาด แดดส่อง",
      "เหมือนชีวิตที่มีทั้งดีและร้าย",
      '"หลังฝนฟ้า จะเจอแดดส่อง"',
    ],
    ability: "มองโลกในแง่ดี ฟื้นหวังเมื่อท้อ",
  },
  {
    id: "#038",
    emoji: "☃️",
    color: "gray",
    nameTH: "หิมะคนแห่งความเย็นใจ",
    nameEN: "Cool Mind Snowman",
    stats: { mind: 55, body: 35, spirit: 45 },
    rarity: "rare",
    lore: ["หิมะคนที่ยืนอยู่ในหนาว", "สอนให้เย็นใจ", '"เย็นใจ ไม่ร้อนรุ่ม"'],
    ability: "เย็นใจ ไม่ตื่นเต้นเวลาสอบ",
  },
  {
    id: "#039",
    emoji: "🌖",
    color: "gray",
    nameTH: "พระจันทร์แห่งการทบทวน",
    nameEN: "Review Moon",
    stats: { mind: 65, body: 50, spirit: 45 },
    rarity: "epic",
    lore: [
      "พระจันทร์ที่ส่องแสงในคืนมืด",
      "ช่วยให้ทบทวนได้",
      '"แสงจันทร์ ส่องทาง"',
    ],
    ability: "ทบทวนในค่ำคืน จำได้ดีขึ้น 50%",
  },
  {
    id: "#040",
    emoji: "⛅️",
    color: "gray",
    nameTH: "เมฆมุมเห็นฟ้า",
    nameEN: "Clear Sky Cloud",
    stats: { mind: 75, body: 45, spirit: 55 },
    rarity: "legendary",
    lore: [
      "เมฆที่ระบายให้ท้องฟ้าโล่ง",
      "เหมือนความคิดที่ชัดเจน",
      '"ท้องฟ้าโล่ง ความคิดโล่ง"',
      '"เห็นทาง ไปถึงฝัน"',
    ],
    ability: "มองเห็นภาพรวม ความคิดสร้างสรรค์ แก้ปัญหาได้อย่างลงตัว",
  },
];

// ============================================================
// ALL_CARDS - Combined
// ============================================================

export const ALL_CARDS: Card[] = [
  ...RED_CARDS,
  ...BLUE_CARDS,
  ...GREEN_CARDS,
  ...YELLOW_CARDS,
  ...GRAY_CARDS,
];

// ============================================================
// Rarity Colors & Spawning
// ============================================================

export const RARITY_CONFIG: Record<
  Rarity,
  {
    stars: string;
    spawnRate: number;
    borderColor: string;
    glowIntensity: number;
  }
> = {
  common: {
    stars: "⭐",
    spawnRate: 50,
    borderColor: "border-gray-400",
    glowIntensity: 0,
  },
  uncommon: {
    stars: "⭐⭐",
    spawnRate: 30,
    borderColor: "border-green-500",
    glowIntensity: 1,
  },
  rare: {
    stars: "⭐⭐⭐",
    spawnRate: 15,
    borderColor: "border-blue-500",
    glowIntensity: 2,
  },
  epic: {
    stars: "⭐⭐⭐⭐",
    spawnRate: 4,
    borderColor: "border-purple-500",
    glowIntensity: 3,
  },
  legendary: {
    stars: "⭐⭐⭐⭐⭐",
    spawnRate: 1,
    borderColor: "border-yellow-500",
    glowIntensity: 4,
  },
};

// ============================================================
// Helper Functions
// ============================================================

export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}

export function getCardsByColor(color: EggColor): Card[] {
  return ALL_CARDS.filter((c) => c.color === color);
}

export function getCardByEmoji(
  color: EggColor,
  emoji: string,
): Card | undefined {
  return ALL_CARDS.find((c) => c.color === color && c.emoji === emoji);
}

export function getRandomCardEmoji(color: EggColor): string {
  const emojiSet = LEVEL6_EMOJI_SETS[color];
  const index = Math.floor(Math.random() * emojiSet.length);
  return emojiSet[index];
}

export function getRandomCard(color: EggColor): Card {
  const cards = getCardsByColor(color);
  // Weight by rarity spawn rate
  const weightedCards: Card[] = [];
  cards.forEach((card) => {
    const weight = RARITY_CONFIG[card.rarity].spawnRate;
    for (let i = 0; i < weight; i++) {
      weightedCards.push(card);
    }
  });
  return weightedCards[Math.floor(Math.random() * weightedCards.length)];
}

// ============================================================
// Collection Management
// ============================================================

const STORAGE_KEY = "eggCardCollection";

function getEmptyCollection(): CardCollection {
  return {
    red: Object.fromEntries(LEVEL6_EMOJI_SETS.red.map((e) => [e, 0])) as Record<
      string,
      number
    >,
    blue: Object.fromEntries(
      LEVEL6_EMOJI_SETS.blue.map((e) => [e, 0]),
    ) as Record<string, number>,
    green: Object.fromEntries(
      LEVEL6_EMOJI_SETS.green.map((e) => [e, 0]),
    ) as Record<string, number>,
    yellow: Object.fromEntries(
      LEVEL6_EMOJI_SETS.yellow.map((e) => [e, 0]),
    ) as Record<string, number>,
    gray: Object.fromEntries(
      LEVEL6_EMOJI_SETS.gray.map((e) => [e, 0]),
    ) as Record<string, number>,
  };
}

export function getCollection(): CardCollection {
  if (typeof window === "undefined") return getEmptyCollection();
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : getEmptyCollection();
  } catch {
    return getEmptyCollection();
  }
}

export function saveCollection(collection: CardCollection): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

export function addCard(color: EggColor, emoji: string): void {
  const collection = getCollection();
  collection[color][emoji] = (collection[color][emoji] || 0) + 1;
  saveCollection(collection);
}

export function getCardCount(color: EggColor, emoji: string): number {
  const collection = getCollection();
  return collection[color]?.[emoji] || 0;
}

export function getUniqueCount(color: EggColor): number {
  const collection = getCollection();
  return Object.values(collection[color]).filter((count) => count > 0).length;
}

export function getTotalCount(color: EggColor): number {
  const collection = getCollection();
  return Object.values(collection[color]).reduce(
    (sum, count) => sum + count,
    0,
  );
}

export function isSetComplete(color: EggColor): boolean {
  return getUniqueCount(color) === 8;
}

export function getTotalCards(): number {
  const collection = getCollection();
  return Object.values(collection).reduce(
    (sum: number, set: Record<string, number>) =>
      sum + Object.values(set).reduce((s: number, c: number) => s + c, 0),
    0,
  );
}

export function getUniqueCards(): number {
  const collection = getCollection();
  return Object.values(collection).reduce(
    (sum: number, set: Record<string, number>) =>
      sum + Object.values(set).filter((c: number) => c > 0).length,
    0,
  );
}
