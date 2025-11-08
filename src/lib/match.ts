import { Profile } from "@/types/db";



export function normalize(str: string): string[] {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0);
}



const SYNONYMS: Record<string, string> = {
  js: "javascript",
  py: "python",
  ts: "typescript",
  ml: "machine learning",
  ai: "artificial intelligence",
  cpp: "c++",
  reactjs: "react",
  node: "nodejs",
  "node.js": "nodejs",
  "node js": "nodejs",
  dsa: "data structures and algorithms",
  "data structures": "data structures and algorithms",
  algorithms: "data structures and algorithms",
  ui: "user interface",
  ux: "user experience",
  db: "database",
  sql: "database",
  nosql: "database",
  css: "cascading style sheets",
  html: "hypertext markup language",
};



function expandWithSynonyms(tokens: Set<string>): Set<string> {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    if (SYNONYMS[token]) {
      expanded.add(SYNONYMS[token]);
      
      const synTokens = normalize(SYNONYMS[token]);
      synTokens.forEach((t) => expanded.add(t));
    }
  }
  return expanded;
}



export function tokenizeSkills(input: string | string[]): Set<string> {
  let tokens = new Set<string>();

  if (typeof input === "string") {
    
    const parts = input.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
    for (const part of parts) {
      const normalized = normalize(part);
      normalized.forEach((token) => tokens.add(token));
    }
  } else if (Array.isArray(input)) {
    for (const skill of input) {
      const normalized = normalize(skill);
      normalized.forEach((token) => tokens.add(token));
    }
  }

  
  return expandWithSynonyms(tokens);
}



function lev(a: string, b: string): number {
  if (a === b) return 0;
  
  const lenA = a.length;
  const lenB = b.length;

  
  if (Math.abs(lenA - lenB) > 2) return -1;

  
  if (lenA === 0) return lenB <= 2 ? lenB : -1;
  if (lenB === 0) return lenA <= 2 ? lenA : -1;

  
  if (lenA === lenB) {
    let diff = 0;
    for (let i = 0; i < lenA; i++) {
      if (a[i] !== b[i]) {
        diff++;
        if (diff > 2) return -1;
      }
    }
    return diff;
  }

  
  if (Math.abs(lenA - lenB) === 1) {
    const shorter = lenA < lenB ? a : b;
    const longer = lenA < lenB ? b : a;
    
    
    let shortIdx = 0;
    for (let i = 0; i < longer.length && shortIdx < shorter.length; i++) {
      if (longer[i] === shorter[shortIdx]) {
        shortIdx++;
      }
    }
    
    if (shortIdx === shorter.length) return 1;
    
    
    if (shorter.length >= 3) {
      let matches = 0;
      const minLen = Math.min(shorter.length, longer.length);
      for (let i = 0; i < minLen; i++) {
        if (shorter[i] === longer[i] || shorter[i] === longer[i + 1]) {
          matches++;
        }
      }
      if (matches >= minLen - 1) return 1;
    }
    
    return -1;
  }

  
  if (Math.abs(lenA - lenB) === 2) {
    const shorter = lenA < lenB ? a : b;
    const longer = lenA < lenB ? b : a;
    
    
    let shortIdx = 0;
    let skips = 0;
    for (let i = 0; i < longer.length && shortIdx < shorter.length; i++) {
      if (longer[i] === shorter[shortIdx]) {
        shortIdx++;
      } else {
        skips++;
        if (skips > 2) return -1;
      }
    }
    if (shortIdx === shorter.length && skips <= 2) return 2;
    
    return -1;
  }

  return -1;
}



function tokenSimilarity(desired: string, offered: string): number {
  
  if (desired === offered) return 1.0;

  
  if (desired.length >= 3 && offered.length >= 3) {
    if (desired.startsWith(offered) || offered.startsWith(desired)) {
      return 0.7;
    }
  }

  
  const distance = lev(desired, offered);
  if (distance === 1) return 0.6;
  if (distance === 2) return 0.5;

  return 0;
}



export function skillSimilarity(desired: string[], offered: string[]): number {
  if (desired.length === 0) return 0;
  if (offered.length === 0) return 0;

  const desiredTokens = tokenizeSkills(desired);
  const offeredTokens = tokenizeSkills(offered);

  if (desiredTokens.size === 0) return 0;
  if (offeredTokens.size === 0) return 0;

  
  let totalScore = 0;
  let matchCount = 0;

  for (const desiredToken of desiredTokens) {
    let bestScore = 0;

    for (const offeredToken of offeredTokens) {
      const score = tokenSimilarity(desiredToken, offeredToken);
      if (score > bestScore) {
        bestScore = score;
      }
    }

    if (bestScore > 0) {
      totalScore += bestScore;
      matchCount++;
    }
  }

  
  const avgScore = matchCount > 0 ? totalScore / desiredTokens.size : 0;
  return Math.min(avgScore, 1.0);
}



export function scoreProfile(
  desiredSkillsInput: string | string[],
  profile: Profile
): number {
  
  const desiredArray = typeof desiredSkillsInput === "string"
    ? desiredSkillsInput.split(",").map((s) => s.trim()).filter((s) => s.length > 0)
    : desiredSkillsInput;

  if (desiredArray.length === 0) {
    
    const rating = profile.rating ?? 0;
    const ratingNorm = Math.max(0, Math.min(rating / 5, 1));
    return ratingNorm;
  }

  
  const offeredSkills = profile.skills || [];

  
  const skillScore = skillSimilarity(desiredArray, offeredSkills);

  
  const rating = profile.rating ?? 0;
  const ratingNorm = Math.max(0, Math.min(rating / 5, 1));

  
  const finalScore = 0.7 * skillScore + 0.3 * ratingNorm;

  return finalScore;
}

