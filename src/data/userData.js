// Initial User Data Schema for Indiverse with Profile, Duolingo-style Levels & XP
export const CURRENT_USER_DATA_VERSION = 'v4_profile_levels_xp';

export function calculateLevelAndRank(xp = 0) {
  if (xp >= 1400) return { level: 7, rankTitle: 'Indiverse Legend', nextTierXp: 2000, prevTierXp: 1400, tierColor: '#E11D48', badgeIcon: '👑', frameStyle: 'gold' };
  if (xp >= 1000) return { level: 6, rankTitle: 'Culture Sage', nextTierXp: 1400, prevTierXp: 1000, tierColor: '#7C3AED', badgeIcon: '🛕', frameStyle: 'purple' };
  if (xp >= 700) return { level: 5, rankTitle: 'Sahyadri Vanguard', nextTierXp: 1000, prevTierXp: 700, tierColor: '#2563EB', badgeIcon: '🛡️', frameStyle: 'blue' };
  if (xp >= 450) return { level: 4, rankTitle: 'Tradition Keeper', nextTierXp: 700, prevTierXp: 450, tierColor: '#059669', badgeIcon: '🌿', frameStyle: 'green' };
  if (xp >= 250) return { level: 3, rankTitle: 'Folklore Apprentice', nextTierXp: 450, prevTierXp: 250, tierColor: '#D97706', badgeIcon: '📜', frameStyle: 'amber' };
  if (xp >= 100) return { level: 2, rankTitle: 'Heritage Seeker', nextTierXp: 250, prevTierXp: 100, tierColor: '#FF6600', badgeIcon: '🔍', frameStyle: 'orange' };
  return { level: 1, rankTitle: 'Novice Explorer', nextTierXp: 100, prevTierXp: 0, tierColor: '#FF5500', badgeIcon: '🌱', frameStyle: 'bronze' };
}

export const INITIAL_USER_DATA = {
  name: 'Culture Explorer',
  handle: '@culture_explorer',
  avatarUrl: '', // Uploaded image data URL or empty for preset avatar
  presetAvatar: '⚔️', // Default cultural emoji avatar if no photo uploaded
  bio: 'Exploring 5,000+ years of Bharatiya heritage & folklore. From Dadi’s lap to lock screen! 🚩',
  region: 'Maharashtra Pilot',
  xp: 0,
  streak: 3,
  gems: 150,
  dailyGoalXp: 50,
  dailyXpEarned: 0,
  completedCourses: [],
  earnedStamps: [],
  completedQuests: [],
  claimedDailyDate: null,
  level: 1,
  rankTitle: 'Novice Explorer'
};

