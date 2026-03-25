# Card Collection System - Development Plan

## 📋 Development Steps (Step ละ 1 ไฟล์)

---

## Step 1: lib/cardData.ts

**File:** `lib/cardData.ts`

**Goals:**

- กำหนดข้อมูลการ์ดทั้งหมด (40 การ์ด = 5 sets × 8 cards)
- กำหนด stats, rarity, lore สำหรับแต่ละการ์ด

**Features:**

- [ ] Define Card interface (id, emoji, name, stats, rarity, lore)
- [ ] Create all 40 card data
- [ ] Export LEVEL6_EMOJI_SETS
- [ ] Export helper functions

**Sample Data Structure:**

```typescript
// lib/cardData.ts

export type EggColor = "red" | "blue" | "green" | "yellow" | "gray";
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface CardStats {
  focus: number; // ⚡ สมาธิ
  endurance: number; // 🛡️ ความแข็งแกร่ง
  speed: number; // 💨 ความเร็ว
  luck?: number; // 🍀 โชค (hidden)
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

// ตัวอย่างการ์ด #003 (Yellow Set - Fruits)
export const SAMPLE_CARD: Card = {
  id: "#003",
  emoji: "🍎",
  color: "yellow",
  nameTH: "ส้มสมบูรณ์",
  nameEN: "Mandarin of Focus",
  stats: { focus: 45, endurance: 30, speed: 25, luck: 20 },
  rarity: "rare",
  lore: [
    "ในคืนที่นักเรียนนั่งอ่านหนังสือจนดึก",
    "รู้สึกหมดแรงและเริ่มจะนอนหลับ...",
    "ส้มลูกนี้ปรากฏกายขึ้น",
    '"ทานเพียงลูกเดียว สมาธิจะกลับมา"',
  ],
  ability: "ช่วยให้สมาธิดีขึ้น อ่านหนังสือได้นานขึ้น 30 นาที",
};

// ตัวอย่างการ์ด Legendary
export const SAMPLE_LEGENDARY: Card = {
  id: "#008",
  emoji: "🥝",
  color: "yellow",
  nameTH: "เมืองทองแห่งความจำ",
  nameEN: "Golden Kiwi of Memory",
  stats: { focus: 99, endurance: 95, speed: 88, luck: 77 },
  rarity: "legendary",
  lore: [
    "ในตำนานเล่าว่า ผู้ที่ได้กินเมืองทองนี้",
    "จะจำได้ทุกสิ่งที่เคยอ่าน",
    "นักเรียนผู้หนึ่งใช้มาสอบเข้ามหาวิทยาลัย",
    "และได้คะแนนเต็ม... ตั้งแต่นั้นมา",
    "ไม่มีใครเคยเห็นเมืองทองลูกนั้นอีกเลย",
  ],
  ability: "จำได้ทุกสิ่งที่อ่าน ความจำไม่ลดลุก นาน 24 ชั่วโมง",
};

export const LEVEL6_EMOJI_SETS: Record<EggColor, string[]> = {
  red: ["👮", "👷", "👨‍🌾", "👨‍🍳", "👨‍⚕️", "👨‍🏫", "👨‍💻", "👨‍🔧"],
  blue: ["🍔", "🍕", "🍜", "🍣", "🍦", "🍩", "🍰", "🧁"],
  green: ["🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
  yellow: ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝"],
  gray: ["☀️", "🌧️", "⛈️", "❄️", "🌦️️", "☃️", "🌖", "⛅️"],
};

export const ALL_CARDS: Card[] = [
  // Red Set (#001-#008) - People/Jobs
  // Blue Set (#009-#016) - Food
  // Green Set (#017-#024) - Animals
  // Yellow Set (#025-#032) - Fruits
  // Gray Set (#033-#040) - Weather
  // ... (total 40 cards)
];

export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((c) => c.id === id);
}

export function getCardsByColor(color: EggColor): Card[] {
  return ALL_CARDS.filter((c) => c.color === color);
}
```

---

## Step 2: components/card/Card3D.tsx

**File:** `components/card/Card3D.tsx`

**Goals:**

- สร้าง Component การ์ด 3D ที่หมุนได้
- แสดงทั้งด้านหน้าและด้านหลัง
- ใส่เอฟเฟกต์ holographic

**Features:**

- [ ] CSS 3D flip animation
- [ ] Front side: number, emoji, name, stats, rarity
- [ ] Back side: lore, ability
- [ ] Holographic border effect
- [ ] Rarity-based styling
- [ ] Click/hover to flip

**Props:**

```typescript
interface Card3DProps {
  card: Card;
  isFlipped?: boolean;
  onFlip?: () => void;
  showCount?: number; // แสดงจำนวน (x1, x2, ...)
}
```

**Sample Usage:**

```tsx
<Card3D card={SAMPLE_CARD} isFlipped={false} onFlip={() => {}} />
<Card3D card={SAMPLE_CARD} isFlipped={false} showCount={3} />
```

---

## Step 3: pages/card-design.tsx

**File:** `pages/card-design.tsx`

**Goals:**

- หน้าสำหรับออกแบบและทดสอบการ์ด
- เลือกดูการ์ดแต่ละใบได้
- ทดสอบ flip animation

**Features:**

- [ ] Card selector (dropdown หรือ grid)
- [ ] Display selected card in 3D
- [ ] Toggle flip button
- [ ] Show all card data (debug view)
- [ ] Add to menu navigation

**Preview:**

```tsx
// pages/card-design.tsx

export default function CardDesignPage() {
  const [selectedCard, setSelectedCard] = useState<Card>(SAMPLE_CARD);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="p-8">
      <h1>Card Design Preview</h1>

      <select onChange={(e) => setSelectedCard(getCardById(e.target.value))}>
        {ALL_CARDS.map((card) => (
          <option value={card.id}>
            {card.id} - {card.nameTH}
          </option>
        ))}
      </select>

      <Card3D
        card={selectedCard}
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)}
      />

      <button onClick={() => setIsFlipped(!isFlipped)}>Flip Card</button>

      {/* Debug info */}
      <pre>{JSON.stringify(selectedCard, null, 2)}</pre>
    </div>
  );
}
```

---

## Step 4: components/card/CardReveal.tsx

**File:** `components/card/CardReveal.tsx`

**Goals:**

- Component แสดงตอนไข่แตกและการ์ดปรากฏ
- Animation ของ egg crack → light burst → card materialize

**Features:**

- [x] Egg crack animation
- [x] Light burst/particle effect
- [x] Card fade in + scale up
- [x] Floating 3D rotation
- [x] Tap anywhere to dismiss

**Props:**

```typescript
interface CardRevealProps {
  card: Card;
  onComplete: () => void;
}
```

**Animation Timeline:**

```
0ms: Egg starts cracking
500ms: Egg fully cracks, light bursts
800ms: Card starts fading in
1200ms: Card at full size, starts floating/rotating
∞: Wait for tap → onComplete()
```

---

## Step 5: components/card/CardFlight.tsx

**File:** `components/card/CardFlight.tsx`

**Goals:**

- Component จัดการ animation การ์ดบินไปยังสมุด
- Bezier curve path พร้อม sparkle trail

**Features:**

- [ ] Bezier curve flight path
- [ ] Sparkle/particle trail
- [ ] Card shrinks as it flies
- [ ] Book slot highlight on arrival
- [ ] Save confirmation animation

**Props:**

```typescript
interface CardFlightProps {
  card: Card;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  onComplete: () => void;
}
```

---

## Step 6: components/card/CollectionBook.tsx

**File:** `components/card/CollectionBook.tsx`

**Goals:**

- Component แสดงสมุดสะสมการ์ด
- Grid layout 4x2 ต่อชุด
- Empty slots และ filled slots

**Features:**

- [ ] Grid layout 4x2
- [ ] Empty slot design (shadow/emboss emoji)
- [ ] Filled slot with Card3D component
- [ ] Count badge (x1, x2, ...)
- [ ] Progress display (Unique/Total)
- [ ] Card hover effect (tilt, shine)
- [ ] Bonus card slot (locked when incomplete)

**Props:**

```typescript
interface CollectionBookProps {
  setColor: EggColor;
  collection: CardCollection;
  onCardClick?: (card: Card) => void;
}
```

---

## Step 7: pages/collection-book.tsx

**File:** `pages/collection-book.tsx`

**Goals:**

- หน้าสมุดสะสมการ์ดหลัก
- Set navigation (1/5, 2/5, ...)
- Page flip animation between sets

**Features:**

- [ ] Book background (สีดำ + purple/gold aura)
- [ ] Set navigation buttons
- [ ] Page flip animation
- [ ] CollectionBook component integration
- [ ] Bonus card reveal when set complete
- [ ] Add to menu navigation

**Preview:**

```tsx
// pages/collection-book.tsx

export default function CollectionBookPage() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const sets: EggColor[] = ["red", "blue", "green", "yellow", "gray"];
  const collection = getCollection();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <button onClick={() => setCurrentSetIndex((i) => Math.max(0, i - 1))}>
          ← Previous
        </button>
        <h1>Collection Book</h1>
        <span>Set {currentSetIndex + 1}/5</span>
        <button onClick={() => setCurrentSetIndex((i) => Math.min(4, i + 1))}>
          Next →
        </button>
      </div>

      {/* Book Content */}
      <CollectionBook
        setColor={sets[currentSetIndex]}
        collection={collection}
      />

      {/* Set Name Display */}
      <div className="text-center text-2xl font-bold">
        {getSetName(sets[currentSetIndex])}
      </div>
    </div>
  );
}
```

---

## Step 8: components/egg/GameEgg.tsx (modify)

**File:** `components/egg/GameEgg.tsx`

**Goals:**

- เพิ่ม logic ตรวจจับไข่ Level 6
- เรียก CardReveal + CardFlight components
- บันทึกการ์ดเข้า localStorage

**Features:**

- [ ] Detect level 6 click
- [ ] Show CardReveal
- [ ] On tap → Show CardFlight
- [ ] Save to collection
- [ ] Debug function to add level 6 egg

**New Code:**

```tsx
// Add to existing GameEgg component

const [showCardReveal, setShowCardReveal] = useState(false);
const [revealedCard, setRevealedCard] = useState<Card | null>(null);

const handleEggClick = () => {
  if (egg.level === 6) {
    // Get random card from egg's color
    const card = getRandomCard(egg.color);
    setRevealedCard(card);
    setShowCardReveal(true);
  } else {
    // Existing tap logic
  }
};

const handleCardRevealComplete = () => {
  // Card flies to book
  setShowCardReveal(false);

  // Save to collection
  if (revealedCard) {
    addCard(revealedCard.color, revealedCard.emoji);
  }
};

// Debug function
const addDebugLevel6Egg = () => {
  setEgg({ ...egg, level: 6 });
};
```

---

## 🗂️ File Structure

```
egg_game/
├── lib/
│   └── cardData.ts              ← Step 1
│
├── components/
│   └── card/
│       ├── Card3D.tsx           ← Step 2
│       ├── CardReveal.tsx       ← Step 4
│       ├── CardFlight.tsx       ← Step 5
│       └── CollectionBook.tsx   ← Step 6
│
├── pages/
│   ├── card-design.tsx          ← Step 3
│   └── collection-book.tsx      ← Step 7
│
└── components/egg/
    └── GameEgg.tsx              ← Step 8 (modify)
```

---

## 📝 Example Card Data (ด้านหน้า + ด้านหลัง)

### Example 1: Common Card (🍔 Blue Set)

**ด้านหน้า:**

```
┌────────────────────────────────────────┐
│  ★ #009            ⭐ Common           │
│   ┌────────────────────────────────┐  │
│   │                                │  │
│   │            🍔                  │  │
│   │                                │  │
│   │       "เบอร์เกอร์พลัง"          │  │
│   │     Power Burger                │  │
│   │                                │  │
│   │   ⚡ 20  🛡️ 35  💨 40           │  │
│   └────────────────────────────────┘  │
│    ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨         │
└────────────────────────────────────────┘
```

**ด้านหลัง:**

```
┌────────────────────────────────────────┐
│  📖 ประวัติการ์ด                     │
│   ┌────────────────────────────────┐  │
│   │ เบอร์เกอร์ที่นักเรียนทำขาด   │  │
│   │ "กินแล้วมีแรงต่อไป!"         │  │
│   │                                │  │
│   │  ⚡ สมาธิ (Focus)              │  │
│   │  พลังน้อย แต่กินง่าย         │  │
│   │                                │  │
│   │  🛡️ ความแข็งแกร่ง           │  │
│   │  ทนต่อความหิวได้ดี           │  │
│   │                                │  │
│   │  💨 ความเร็ว (Speed)           │  │
│   │  กินเร็ว อิ่มเร็ว             │  │
│   └────────────────────────────────┘  │
│   Set 2: Food  |  Power: 95          │
└────────────────────────────────────────┘
```

### Example 2: Rare Card (🐱 Green Set)

**ด้านหน้า:**

```
┌────────────────────────────────────────┐
│  ★ #017            ⭐⭐⭐ Rare          │
│   ┌────────────────────────────────┐  │
│   │                                │  │
│   │            🐱                  │  │
│   │                                │  │
│   │       "เจ้าเหมียวนำโชค"         │  │
│   │     Lucky Cat                   │  │
│   │                                │  │
│   │   ⚡ 40  🛡️ 35  💨 50  🍀 60    │  │
│   └────────────────────────────────┘  │
│    ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨         │
└────────────────────────────────────────┘
```

**ด้านหลัง:**

```
┌────────────────────────────────────────┐
│  �วเรื่องเล่าขาน                   │
│   ┌────────────────────────────────┐  │
│   │ แมวที่ช่วยนักเรียนผ่าน       │  │
│   │ ช่วงเวลายากลำบากที่สุด       │  │
│   │ เมื่อนักเรียนกำลังจะท้อ      │  │
│   │ เจ้าเหมียวปรากฏตัวขึ้น       │  │
│   │ "เธอจะผ่านไปได้แน่นอน"       │  │
│   │                                │  │
│   │  ⚡ สมาธิ (Focus)              │  │
│   │  ช่วยให้มีสมาธิสั้นๆ          │  │
│   │                                │  │
│   │  🍀 โชค (Luck)                 │  │
│   │  เจอข้อสอบที่ถนัด!            │  │
│   └────────────────────────────────┘  │
│   Set 3: Animals  |  Power: 185      │
└────────────────────────────────────────┘
```

### Example 3: Legendary Card (☀️ Gray Set)

**ด้านหน้า:**

```
┌────────────────────────────────────────┐
│  ★ #033          ⭐⭐⭐⭐⭐ Legendary    │
│   ┌────────────────────────────────┐  │
│   │                                │  │
│   │            ☀️                  │  │
│   │                                │  │
│   │       "ดวงอาทิตย์แห่งปัญญา"    │  │
│   │     Sun of Wisdom               │  │
│   │                                │  │
│   │   ⚡ 99  🛡️ 95  💨 88  🍀 90    │  │
│   └────────────────────────────────┘  │
│  ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨      │
└────────────────────────────────────────┘
```

**ด้านหลัง:**

```
┌────────────────────────────────────────┐
│  📜 ตำนานแห่งดวงอาทิตย์             │
│   ┌────────────────────────────────┐  │
│   │ "ในวันที่มืดมนที่สุด        │  │
│   │  ดวงอาทิตย์ลูกนี้ลงมา      │  │
│   │  มอบแสงสว่างให้ผู้ที่ศรัทธา │  │
│   │  นักเรียนผู้นั้นได้กลายเป็น   │  │
│   │  ผู้สอบผ่านที่ยิ่งใหญ่ที่สุด" │  │
│   │                                │  │
│   │  ⚡ สมาธิอมตะ                 │  │
│   │  อ่านอะไรก็จำได้ทันที        │  │
│   │                                │  │
│   │  🍀 โชคชะตา                    │  │
│   │  ข้อสอบที่ออกมาจะเป็นข้อที่  │  │
│   │  เราเตรียมมาทั้งหมด          │  │
│   └────────────────────────────────┘  │
│   Set 5: Weather  |  Power: 372      │
└────────────────────────────────────────┘
```

---

## 🎯 Priority Order

1. **Step 1** - `lib/cardData.ts` (กำหนดโครงสร้างข้อมูล)
2. **Step 2** - `components/card/Card3D.tsx` (Component พื้นฐาน)
3. **Step 3** - `pages/card-design.tsx` (หน้าทดสอบ)
4. **Step 6** - `components/card/CollectionBook.tsx` (สมุด)
5. **Step 7** - `pages/collection-book.tsx` (หน้าสมุด)
6. **Step 4** - `components/card/CardReveal.tsx` (Animation)
7. **Step 5** - `components/card/CardFlight.tsx` (Animation)
8. **Step 8** - `components/egg/GameEgg.tsx` (เชื่อมทุกอย่าง)

---

## 🧪 Testing

### Per Step Testing

- **Step 1-3:** Test card flip, rarity display, data accuracy
- **Step 6-7:** Test grid layout, empty slots, count badges, set navigation
- **Step 4-5:** Test animation timing, smoothness
- **Step 8:** Test full flow (egg → reveal → flight → save)

### Integration Testing

- Test localStorage save/load
- Test getting duplicate cards
- Test set completion → bonus card reveal
