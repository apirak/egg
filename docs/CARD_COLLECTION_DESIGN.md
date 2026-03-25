# Card Collection System - Game Design Document

## 🎯 Game Goal (เป้าหมายของเกม)

**"สะสมของวิเศษ บรรลุฝันเข้ามหาวิทยาลัย"**

เกมเล่าเรื่องราวของ "นักเรียนคนหนึ่ง" ที่พยายามสอบเข้ามหาวิทยาลัยในฝัน ในโลกที่เต็มไปด้วยของวิเศษ แต่ละการ์ดที่ได้จากไข่ Level 6 คือ "ของวิเศษ" ที่ช่วยให้:
- เก่งขึ้น (เพิ่ม Focus)
- โชคดีขึ้น (เพิ่ม Luck)
- อ่านหนังสือดีขึ้น (เพิ่ม Focus + Endurance)
- อ่านทนขึ้น (เพิ่ม Endurance)
- มีกำลังใจ (เพิ่มทุก stats)

ผู้เล่นสะสมการ์ดเพื่อสร้าง "สำรับของวิเศษ" ที่จะช่วยให้ตัวเองบรรลุเป้าหมายในชีวิต

---

## 🎴 Card Design (การ์ดเกม)

### Card Structure

```
┌─────────────────────────────────────────────────┐
│  ★ #003              ⭐⭐⭐ Rare                 │  ← Number & Rarity
│   ┌─────────────────────────────────────────┐   │
│   │                                         │   │
│   │               🍎                         │   │  ← Large Emoji
│   │                                         │   │
│   │          "ส้มสมบูรณ์"                   │   │  ← Thai Name
│   │       Mandarin of Focus                  │   │  ← English Name
│   │                                         │   │
│   │    ⚡ 45  🛡️ 30  💨 25  🍀 ???            │   │  ← Stats
│   └─────────────────────────────────────────┘   │
│    ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨              │  ← Holographic Border
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  📖 ประวัติการ์ด / Card Lore                 │
│   ┌─────────────────────────────────────────┐   │
│   │  ในคืนที่นักเรียนนั่งอ่านหนังสือ     │   │
│   │  จนดึก รู้สึกหมดแรงและเริ่มจะ       │   │
│   │  นอนหลับ... ส้มลูกนี้ปรากฏขึ้น     │   │
│   │  "ทานเพียงลูกเดียว สมาธิจะกลับมา" │   │
│   │                                         │   │
│   │  ┌─────────────────────────────┐        │   │
│   │  │ ⚡ สมาธิ (Focus)            │        │   │
│   │  │ ช่วยให้อ่านหนังสือได้นานขึ้น   │   │
│   │  │ เพิ่มความสามารถในการจดจำ     │   │
│   │  └─────────────────────────────┘        │   │
│   │                                         │   │
│   │  ┌─────────────────────────────┐        │   │
│   │  │ 🛡️ ความแข็งแกร่ง (Endurance) │ │   │
│   │  │ ทนต่อความเหนื่อยล้าได้ดีขึ้น  │   │
│   │  │ อ่านได้นานโดยไม่เพลีย       │   │
│   │  └─────────────────────────────┘        │   │
│   │                                         │   │
│   │  ┌─────────────────────────────┐        │   │
│   │  │ 💨 ความเร็ว (Speed)          │   │   │
│   │  │ ทำข้อสอบได้เร็วขึ้น           │   │
│   │  │ จบการสอบภายในเวลา            │   │
│   │  └─────────────────────────────┘        │   │
│   │                                         │   │
│   └─────────────────────────────────────────┘   │
│   Set 4: Fruits  |  Total Power: 100          │
└─────────────────────────────────────────────────┘
```

### Card Stats Explained

| Icon | Stat | ภาษาไทย | Effect |
|------|------|----------|--------|
| ⚡ | Focus | สมาธิ | อ่านหนังสือได้นานขึ้น, จดจำดีขึ้น |
| 🛡️ | Endurance | ความแข็งแกร่ง | ทนต่อความเหนื่อยล้า, อ่านทนขึ้น |
| 💨 | Speed | ความเร็ว | ทำข้อสอบได้เร็วขึ้น |
| 🍀 | Luck | โชค | เจอข้อสอบที่ถนัด (hidden stat) |

### Rarity System

|Rarity | Stars | Spawn Rate | Border Color | Glow Effect |
|-------|-------|------------|--------------|-------------|
| Common | ⭐ | 50% | 🪙 Silver | เล็กน้อย |
| Uncommon | ⭐⭐ | 30% | 🟢 Green | ปานกลาง |
| Rare | ⭐⭐⭐ | 15% | 🔵 Blue | ชัดเจน |
| Epic | ⭐⭐⭐⭐ | 4% | 🟣 Purple | แรง + Particles |
| Legendary | ⭐⭐⭐⭐⭐ | 1% | 🟡 Gold | แรงมาก + Golden aura |

---

## 🎨 Theme & Visual Style

### Core Theme

- **Whimsical Fantasy** - แฟนตาซีเบาๆ น่ารัก น่าค้นหา
- **Magical Discovery** - ความรู้สึกตื่นเต้นตอนเปิดไข่
- **Collection Pride** - ความภูมิใจในการสะสม

### Color Palette

- สมุด: สีดำลึกลับไปด้วย Aura สีม่วง/ทอง
- การ์ด: แต่ละชุดมี theme color ของตัวเอง
- เอฟเฟกต์: Sparkle, Glow, Magical particles

---

## 📱 Screen Structure

### 1. Main Game Screen (ปัจจุบัน)

```
┌─────────────────────────────────┐
│  [Menu]              [📚 Cards] │
├─────────────────────────────────┤
│                                 │
│                                 │
│         [Egg Display]           │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### 2. Card Reveal Screen

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│            ✨                   │
│        ┌─────────┐              │
│        │  3D     │              │
│        │  CARD   │  ← Float & Rotate
│        │  🎀     │              │
│        └─────────┘              │
│                                 │
│      [Tap anywhere]             │
│                                 │
└─────────────────────────────────┘
```

### 3. Collection Book (Empty Slot)

```
┌─────────────────────────────────┐
│  [<] Collection Book  [Set 1/5] │
├─────────────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
│  │░░░| │░░░| │░░░| │░░░|      │
│  │░🌟| │░⭐| │░✨| │░💫| ← Shadow/Emboss
│  └───┘ └───┘ └───┘ └───┘      │
│                                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
│  │░░░| │░░░| │░░░| │░░░|      │
│  └───┘ └───┘ └───┘ └───┘      │
│                                 │
│  Unique: 0/8  Total: 0          │
└─────────────────────────────────┘
```

### 4. Collection Book (With Cards - With Duplicates)

```
┌─────────────────────────────────┐
│  [<] Collection Book  [Set 1/5] │
├─────────────────────────────────┤
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐      │
│  │🌟| │⭐| │✨| │💫|      │
│  │✨| │✨| │✨| │✨| ← Holographic shine
│  │x1 | │x3 | │x1 | │x2 | ← Count badge
│  └───┘ └───┘ └───┘ └───┘      │
│                                 │
│  Unique: 4/8  Total: 7          │
│  ┌─────────────────────┐       │
│  │   ??? BONUS CARD    │       │
│  │   🔒 Locked         │       │
│  └─────────────────────┘       │
└─────────────────────────────────┘
```

---

## 🎬 Interaction Design

### Phase 1: Egg Break → Card Reveal

| Step | Action                | Visual             | Sound          |
| ---- | --------------------- | ------------------ | -------------- |
| 1    | User taps Level 6 Egg | Egg cracks open    | Crack sound    |
| 2    | Light bursts from egg | Flash + Particles  | Magical chime  |
| 3    | Card materializes     | Fade in + Scale up | Whoosh         |
| 4    | Card floats/rotates   | Smooth 3D rotation | Subtle sparkle |
| 5    | User taps anywhere    | Card acknowledges  | Tap sound      |

### Phase 2: Card → Book Entry

| Step | Action        | Visual                 | Sound         |
| ---- | ------------- | ---------------------- | ------------- |
| 1    | User taps     | Card flips to back     | Flip sound    |
| 2    | Flight path   | Bezier curve to book   | Swoosh        |
| 3    | Enters book   | Slot lights up + Flash | Success chord |
| 4    | Save complete | Checkmark appears      | Ding!         |
| 5    | Book update   | Progress bar fills     | Slide sound   |

### Bonus Card Reveal

| Step | Action             | Visual              | Sound                 |
| ---- | ------------------ | ------------------- | --------------------- |
| 1    | Complete set (8/8) | All cards glow      | Building anticipation |
| 2    | Golden particles   | Rain from top       | Epic reveal music     |
| 3    | Bonus card appears | Larger, golden aura | Ta-da!                |
| 4    | Save to book       | Special slot opens  | Triumphant fanfare    |

---

## 📚 Card Sets (5 Sets)

ตาม `LEVEL6_EMOJI_SETS` ที่กำหนด:

// SpriteGenerator.ts

```typescript
const LEVEL6_EMOJI_SETS: Record<EggColor, string[]> = {
  red: ["👮", "👷", "👨‍🌾", "👨‍🍳", "👨‍⚕️", "👨‍🏫", "👨‍💻", "👨‍🔧"], // People/Jobs
  blue: ["🍔", "🍕", "🍜", "🍣", "🍦", "🍩", "🍰", "🧁"], // Food
  green: ["🐱", "🐶", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"], // Animals
  yellow: ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝"], // Fruits
  gray: ["☀️", "🌧️", "⛈️", "❄️", "🌦️️", "☃️", "🌖", "⛅️"], // Weather
};
```

| Set | Color  | Theme       | Emojis (8 each)  | Bonus Card |
| --- | ------ | ----------- | ---------------- | ---------- |
| 1   | Red    | People/Jobs | 👮👷👨‍🌾👨‍🍳👨‍⚕️👨‍🏫👨‍💻👨‍🔧 | 👑         |
| 2   | Blue   | Food        | 🍔🍕🍜🍣🍦🍩🍰🧁 | 🍽️         |
| 3   | Green  | Animals     | 🐱🐶🐰🦊🐻🐼🐨🐯 | 🦁         |
| 4   | Yellow | Fruits      | 🍎🍊🍋🍇🍓🍑🍒🥝 | 🍇         |
| 5   | Gray   | Weather     | ☀️🌧️⛈️❄️🌦️️☃️🌖⛅️ | 🌈         |

---

## 💾 Data Structure

เก็บเป็น count ของแต่ละ emoji เพราะอาจได้ซ้ำ:

```typescript
type EggColor = 'red' | 'blue' | 'green' | 'yellow' | 'gray';

interface CardCollection {
  red: Record<string, number>;
  blue: Record<string, number>;
  green: Record<string, number>;
  yellow: Record<string, number>;
  gray: Record<string, number>;
}

// Example usage:
const collection: CardCollection = {
  red: {
    "👮": 0,
    "👷": 1,
    "👨‍🌾": 0,
    "👨‍🍳": 0,
    "👨‍⚕️": 2,  // ได้ซ้ำ 2 ใบ
    "👨‍🏫": 0,
    "👨‍💻": 0,
    "👨‍🔧": 0,
  },
  blue: { ... },
  green: { ... },
  yellow: { ... },
  gray: { ... },
};

// Helper functions
function getUniqueCount(set: EggColor): number {
  return Object.values(collection[set]).filter(count => count > 0).length;
}

function getTotalCount(set: EggColor): number {
  return Object.values(collection[set]).reduce((sum, count) => sum + count, 0);
}

function isSetComplete(set: EggColor): boolean {
  return getUniqueCount(set) === 8;
}
```

---

## 🎯 Wow Factors

### Moment 1: First Egg Break

- Screen shakes slightly
- Golden light spills out
- Card emerges with depth and shine

### Moment 2: Card Flight

- Smooth Bezier curve path
- Trail of sparkles follows card
- Book slot pulses, anticipating

### Moment 3: Set Completion

- Screen-wide celebration
- All 8 cards orbit the bonus card
- Bonus card reveals with dramatic effect

### Moment 4: Book Page Turn

- Smooth page flip animation
- Cards have depth, cast shadows
- Holographic sheen on hover

---

## 🔧 Technical Considerations

### Performance

- Use CSS 3D transforms for card rotation
- Lazy load card assets
- Debounce scroll for book navigation

### Persistence

- Save to localStorage after each card obtain
- Sync with cloud (future feature)

### Accessibility

- Keyboard navigation support
- Screen reader announcements
- Reduced motion mode
