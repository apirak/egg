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

import { RED_CARDS } from "./cards/redCards";
import { BLUE_CARDS } from "./cards/blueCards";
import { GREEN_CARDS } from "./cards/greenCards";
import { YELLOW_CARDS } from "./cards/yellowCards";
import { GRAY_CARDS } from "./cards/grayCards";

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

export function resetCollection(): void {
  saveCollection(getEmptyCollection());
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
