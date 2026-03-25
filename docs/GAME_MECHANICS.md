# หลักการของเกม (Game Mechanics)

## ภาพรวม

Egg Game เป็นเกมแนว Physics-based Puzzle ที่ได้แรงบันดาลใจจาก Suika Game และ 2048 โดยมีเป้าหมายให้ผู้เล่นวางไข่และรวมไข่เหมือนกันให้กลายเป็นไข่ระดับสูงขึ้น

---

## ระบบไข่ (Egg System)

### ประเภทของไข่

เกมมีไข่ทั้งหมด **30 ประเภท** จากการรวมกันของ:
- **5 สี**: Red, Blue, Green, Yellow, Gray
- **6 ระดับ**: Level 1 - 6

| ระดับ | ชื่อ | คำอธิบาย |
|--------|------|-----------|
| 1 | General | ไข่พื้นฐาน |
| 2 | Dot | เริ่มเติบโต |
| 3 | Wristband | แข็งแรงขึ้น |
| 4 | Flash | ใกล้ถึงเป้าหมาย |
| 5 | Golden | ระดับสูง |
| 6 | Royal | ระดับสูงสุด (ไม่สามารถรวมต่อ) |

### ขนาดของไข่

แต่ละระดับมีขนาดเพิ่มขึ้นตาม multiplier ([`EggConfig.ts`](../src/game/config/EggConfig.ts)):

```
Level 1: 1.0x
Level 2: 1.2x
Level 3: 1.4x
Level 4: 1.8x
Level 5: 2.2x
Level 6: 2.6x
```

---

## การเล่นเกม (Gameplay)

### การวางไข่ (Spawning)

1. **แตะ/คลิก** บน canvas เพื่อวางไข่ Level 1
2. ไข่จะถูกสุ่มสีโดยใช้ระบบ **Weighted Random**:
   - Red: น้ำหนัก 2
   - Blue: น้ำหนัก 3
   - Green: น้ำหนัก 4
   - Yellow: น้ำหนัก 5
   - Gray: น้ำหนัก 6

3. **Rapid Fire**: กดค้างเพื่อวางไข่ต่อเนื่อง (interval: `rapidFireIntervalMs` ใน [`Game/index.tsx`](../src/pages/Game/index.tsx))

### กลศาสตร์ (Physics)

เกมใช้ **Matter.js** สำหรับการจำลองฟิสิกส์:

- ไข่มีรูปทรงตามสมการพารามิตริก (Parametric Equations)
- ไข่มี **frictionAir** ต่ำ ทำให้ลื่นไหลและตกลงได้เป็นธรรมชาติ
- มีการ push force เมื่อรวมไข่ เพื่อเคลียร์พื้นที่สำหรับไข่ที่รวมแล้ว

### การควบคุมแรงโน้มถ่วง (Tilt Control)

ในอุปกรณ์มือถือ:
- **สนับสนุน** Device Orientation API
- **iOS**: ต้องขอ permission ก่อน (แสดง modal)
- **Android**: เปิดใช้งานอัตโนมัติ
- เมื่อเปิดใช้งาน: เอนอุปกรณ์เพื่อเปลี่ยนทิศทางแรงโน้มถ่วง

---

## ระบบรวมไข่ (Merge System)

### เงื่อนไขการรวม

ไข่ 2 ฟองจะรวมเป็นฟองเดียวเมื่อ:
1. **สีเหมือนกัน** (same color)
2. **ระดับเหมือนกัน** (same level)
3. **ชนกัน** (collision active)
4. **ไม่อยู่ใน cooldown** (120ms)
5. **ไม่ใช่ Level 6** (ระดับสูงสุด)

### กระบวนการรวม

```
Egg (Level N) + Egg (Level N) → Egg (Level N+1)
```

ตัวอย่าง:
- Red Level 1 + Red Level 1 → Red Level 2
- Blue Level 3 + Blue Level 3 → Blue Level 4

### ตำแหน่งการรวม

ไข่ที่รวมแล้วจะถูกวางที่:
- ตำแหน่งกึ่งกลางระหว่างไข่ 2 ฟอง
- รักษาโมเมนตัมจากไข่เดิม
- มีการ push ไข่ข้างเคียงออกไปเล็กน้อย

---

## Game Loop

### Fixed Timestep

เกมใช้ระบบ Fixed Timestep เพื่อการจำลองฟิสิกส์ที่สม่ำเสมอ ([`GameConfig.ts`](../src/game/config/GameConfig.ts)):

```
Fixed Delta: 16.67ms (60 FPS)
Max Frame Delta: 50ms
Max Substeps: 4
```

### ขั้นตอนต่อเฟรม

1. **Physics Step**: อัปเดตตำแหน่งและการชน
2. **Merge Check**: ตรวจสอบและดำเนินการรวม (สูงสุด 2 คู่ต่อ step)
3. **Bounds Check**: ลบไข่ที่ตกออกนอกขอบเขต
4. **Render**: วาดภาพไข่ทั้งหมดบน canvas

---

## การเรนเดอร์ (Rendering)

### รูปทรงไข่ (Egg Geometry)

ไข่ถูกสร้างด้วย **สมการพารามิตริก** ([`EggGeometryMath.ts`](../src/game/geometry/EggGeometryMath.ts)):

```
x = a * cos(t) * (1 + k * sin(t))
y = b * sin(t)
```

โดยที่:

- `a = 22` - รัศมีความกว้าง (width radius)
- `b = 28` - รัศมีความสูง (height radius)
- `k = 0.15` - ค่าความไม่สมมาตร (asymmetry factor)
  - ค่าบวก = ด้านล่างกว้าง, ด้านบนแหลม
- `t` - พารามิเตอร์วิ่งจาก `-π` ถึง `π`

### Pre-rendered Sprites

ไข่ทุกประเภทถูก pre-render เป็น canvas แยก ([`SpriteGenerator.ts`](../src/game/rendering/SpriteGenerator.ts)):
- ขนาด render scale: 3x
- ขนาดแสดงผล: 1/6 ของ sprite
- ใช้ 120 segments เพื่อความเรียบเนียนของเส้นโค้ง

### Canvas Setup

- รองรับ **High DPI** (Device Pixel Ratio)
- ใช้ `requestAnimationFrame` สำหรับ smooth rendering
- Transform matrix สำหรับ rotation ของไข่

---

## สถาปัตยกรรมโค้ด

### โครงสร้างหลัก

```
src/
├── game/
│   ├── core/          # GameLoop, PhysicsWorld
│   ├── entities/      # EggFactory, EggEntity
│   ├── systems/       # MergeSystem
│   ├── config/        # EggConfig, GameConfig
│   └── geometry/      # EggGeometry, EggGeometryMath
├── hooks/             # useDeviceOrientation
├── pages/             # Game, Home, Menu
└── types/             # egg types
```

### คลาสสำคัญ

| คลาส | หน้าที่ |
|------|----------|
| `PhysicsWorld` | จัดการ Matter.js engine, walls, gravity |
| `GameLoop` | จัดการ game loop ด้วย fixed timestep |
| `EggFactory` | สร้างไข่พร้อม sprite และ physics body |
| `MergeSystem` | ตรวจสอบและดำเนินการรวมไข่ |
| `SpriteGenerator` | Pre-render ไข่เป็น canvas |

---

## การป้องกันปัญหา

### Memory Safety

- ลบไข่ที่ตกออกนอกหน้าจออัตโนมัติ
- Cleanup event listeners เมื่อ component unmount
- Prune old merge cooldown records

### Performance

- Pre-rendered sprites (ไม่วาดใหม่ทุกเฟรม)
- Limited substeps สำหรับ physics
- Efficient collision detection ผ่าน Matter.js

---

## การแก้ไขค่า Config (Configuration Reference)

ค่าต่างๆ ที่สามารถปรับแต่งได้แยกตามหมวดหมู่:

### ตั้งค่าเกมหลัก ([`GameConfig.ts`](../src/game/config/GameConfig.ts))

```typescript
// ขนาด canvas
width: 420
height: 640

// Physics
gravityY: 1
wallThickness: 48
spawnY: 48

// Game Loop
fixedDeltaMs: 1000 / 60  // 60 FPS
maxFrameDeltaMs: 1000 / 20
maxSubsteps: 4

// Tilt Control
tilt.maxTiltAngle: 45
tilt.gravityScale: 0.02
tilt.smoothingFactor: 0.15
tilt.deadZone: 3
```

### ตั้งค่าไข่ ([`EggConfig.ts`](../src/game/config/EggConfig.ts))

```typescript
// ขนาดไข่แต่ละระดับ (multiplier)
EGG_SIZE_MULTIPLIERS = {
  1: 1.0, 2: 1.2, 3: 1.4, 4: 1.8, 5: 2.2, 6: 2.6
}

// น้ำหนักการสุ่มสีไข่
EGG_COLOR_WEIGHTS = {
  red: 2, blue: 3, green: 4, yellow: 5, gray: 6
}

// สูตรรูปทรงไข่ (a, b, k)
DEFAULT_EGG_FORMULA = {
  width: 22,    // ความกว้าง
  height: 28,   // ความสูง
  asymmetry: 0.15  // ความไม่สมมาตร
}

// Render scale
EGG_SPRITE_RENDER_SCALE = 3
GAMEPLAY_EGG_SIZE_RATIO = 1 / 6
```

### ตั้งค่าระบบรวม ([`MergeSystem.ts`](../src/game/systems/MergeSystem.ts))

```typescript
mergeCooldownMs = 120  // เวลาคูลดาวน์หลังรวม
```

### ตั้งค่าการวางไข่ ([`Game/index.tsx`](../src/pages/Game/index.tsx))

```typescript
rapidFireIntervalMs = 90  // ความเร็วการวางไข่แบบกดค้าง
```

### สีไข่ ([`SpriteGenerator.ts`](../src/game/rendering/SpriteGenerator.ts))

```typescript
EGG_COLORS = {
  red: { light, main, dark },
  blue: { light, main, dark },
  green: { light, main, dark },
  yellow: { light, main, dark },
  gray: { light, main, dark }
}
```

---

## ไฟล์อ้างอิง

- [Game Page](../src/pages/Game/index.tsx) - หน้าเกมหลัก
- [Egg Config](../src/game/config/EggConfig.ts) - การตั้งค่าไข่
- [Merge System](../src/game/systems/MergeSystem.ts) - ระบบรวมไข่
- [Physics World](../src/game/core/PhysicsWorld.ts) - จัดการฟิสิกส์
- [Egg Factory](../src/game/entities/EggFactory.ts) - สร้างไข่
