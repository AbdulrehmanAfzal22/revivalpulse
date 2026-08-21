/**
 * ProphetName — renders a prophet's name with the correct Islamic honorific.
 *
 * Honorific rules:
 * - Muhammad → "Muhammad ﷺ"
 * - Other prophets → "Name عليه السلام"
 * - Sahabah → no honorific (display name as-is)
 *
 * Uses the existing nameEnglish property from the story data structure.
 * Designed to be reused across story cards, content, and any UI element
 * that displays prophet names.
 */

/** All 25 prophet names in traditional Quranic order */
const PROPHET_NAMES_ENGLISH = [
  "Adam",
  "Idris",
  "Nuh",
  "Hud",
  "Salih",
  "Ibrahim",
  "Lut",
  "Isma'il",
  "Ishaq",
  "Ya'qub",
  "Yusuf",
  "Ayyub",
  "Shuayb",
  "Musa",
  "Harun",
  "Dawud",
  "Sulayman",
  "Ilyas",
  "Al-Yasa",
  "Yunus",
  "Dhul-Kifl",
  "Zakariyya",
  "Yahya",
  "Isa",
  "Muhammad",
] as const;

/** All sahabi names */
const SAHABI_NAMES_ENGLISH = [
  "Abu Bakr",
  "Umar ibn al-Khattab",
  "Uthman ibn Affan",
  "Ali ibn Abi Talib",
  "Khadijah bint Khuwaylid",
  "Bilal ibn Rabah",
  "Khalid ibn al-Walid",
  "Abu Dharr al-Ghifari",
  "Ammar ibn Yasir",
  "Anas ibn Malik",
  "Hamza ibn Abdal-Muttalib",
  "Mus'ab ibn Umayr",
  "Sad ibn Abi Waqqas",
  "Salman al-Farisi",
  "Zayd ibn Harithah",
] as const;

/** Regex pattern that matches any prophet name as a whole word (case-insensitive) */
const PROPHET_NAME_PATTERN = new RegExp(
  `\\b(${PROPHET_NAMES_ENGLISH.map((n) => n.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

/** Regex pattern that matches any sahabi name as a whole word (case-insensitive) */
const SAHABI_NAME_PATTERN = new RegExp(
  `\\b(${SAHABI_NAMES_ENGLISH.map((n) => n.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

/**
 * Gets the Islamic honorific for a prophet name.
 * - Muhammad: "ﷺ"
 * - Other prophets: " عليه السلام"
 * - Sahabah: empty string
 */
function getProphetHonorific(nameEnglish: string, type: "prophet" | "sahabi"): string {
  const upper = nameEnglish.toLowerCase();

  // Muhammad gets ﷺ
  if (upper === "muhammad") {
    return " ﷺ";
  }

  // Other prophets get عليه السلام
  if (type === "prophet") {
    return " عليه السلام";
  }

  // Sahabah have no honorific in this system
  return "";
}

/**
 * Checks if a name English matches a known prophet name (whole word, case-insensitive).
 */
function isProphetName(nameEnglish: string): boolean {
  return PROPHET_NAME_PATTERN.test(nameEnglish);
}

/**
 * Checks if a name English matches a known sahabi name (whole word, case-insensitive).
 */
function isSahabiName(nameEnglish: string): boolean {
  return SAHABI_NAME_PATTERN.test(nameEnglish);
}

/**
 * ProphetName — renders a prophet's name with the correct Islamic honorific.
 *
 * @param nameEnglish - The English name of the prophet/sahabi (from story data)
 * @param type - 'prophet' or 'sahabi' determines the honorific rules
 * @returns The name with appropriate honorific suffix
 */
export function ProphetName({ nameEnglish, propType }: { nameEnglish: string; propType: "prophet" | "sahabi" }): string {
  const honorific = getProphetHonorific(nameEnglish, propType);

  // If the name is a known prophet, return name + honorific
  if (isProphetName(nameEnglish)) {
    // Capitalize first letter, lowercase the rest for display, then add honorific
    const formattedName = nameEnglish.charAt(0).toUpperCase() + nameEnglish.slice(1).toLowerCase();
    return `${formattedName}${honorific}`;
  }

  // If the name is a known sahabi, return name without honorific
  if (isSahabiName(nameEnglish)) {
    return nameEnglish;
  }

  // For unknown names, return as-is (fallback)
  return nameEnglish;
}

/** Default export for convenient use as a pure function */
export default ProphetName;