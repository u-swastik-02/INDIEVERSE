import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

import { CURRENT_USER_DATA_VERSION, INITIAL_USER_DATA, calculateLevelAndRank } from '../data/userData';

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(() => {
    try {
      const storedVersion = localStorage.getItem('indiverse_user_version');
      const savedData = localStorage.getItem('indiverse_user_data');

      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Merge with INITIAL_USER_DATA so newly added fields exist, but preserve user's xp & progress
        const merged = { ...INITIAL_USER_DATA, ...parsed };
        const { level, rankTitle } = calculateLevelAndRank(merged.xp || 0);
        merged.level = level;
        merged.rankTitle = rankTitle;
        return merged;
      }
    } catch (e) {
      console.error('Error loading user data', e);
    }
    return INITIAL_USER_DATA;
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Sync to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem('indiverse_user_version', CURRENT_USER_DATA_VERSION);
      localStorage.setItem('indiverse_user_data', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  }, [userData]);

  // Update profile fields (name, handle, bio, avatarUrl, presetAvatar, region)
  const updateUserProfile = (updates) => {
    setUserData(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Award XP with dynamic level & rank calculation
  const awardXp = (amount) => {
    setUserData(prev => {
      const newXp = Math.max(0, (prev.xp || 0) + amount);
      const { level, rankTitle } = calculateLevelAndRank(newXp);
      const newDailyXp = (prev.dailyXpEarned || 0) + amount;

      return {
        ...prev,
        xp: newXp,
        level,
        rankTitle,
        dailyXpEarned: newDailyXp
      };
    });
  };

  // Claim daily streak reward
  const claimDailyXp = (rewardXp = 25) => {
    const today = new Date().toDateString();
    let claimed = false;
    setUserData(prev => {
      if (prev.claimedDailyDate === today) return prev;
      claimed = true;
      const newXp = (prev.xp || 0) + rewardXp;
      const { level, rankTitle } = calculateLevelAndRank(newXp);
      return {
        ...prev,
        xp: newXp,
        level,
        rankTitle,
        streak: (prev.streak || 0) + 1,
        gems: (prev.gems || 0) + 15,
        claimedDailyDate: today,
        dailyXpEarned: (prev.dailyXpEarned || 0) + rewardXp
      };
    });
    return claimed;
  };

  // Complete a course: marks completed, awards course XP, awards digital stamp
  const completeCourse = (courseId, xpReward = 150, stampName = '') => {
    let newlyCompleted = false;
    setUserData(prev => {
      if (prev.completedCourses.includes(courseId)) {
        return prev;
      }
      newlyCompleted = true;
      const newCompleted = [...prev.completedCourses, courseId];
      const newStamps = stampName && !prev.earnedStamps.includes(stampName)
        ? [...prev.earnedStamps, stampName]
        : prev.earnedStamps;
      const newXp = (prev.xp || 0) + xpReward;
      const { level, rankTitle } = calculateLevelAndRank(newXp);

      return {
        ...prev,
        xp: newXp,
        completedCourses: newCompleted,
        earnedStamps: newStamps,
        level,
        rankTitle
      };
    });
    return newlyCompleted;
  };

  // Explicitly reset user data to 0 XP and 0 courses completed
  const resetUserData = () => {
    const fresh = { ...INITIAL_USER_DATA };
    setUserData(fresh);
    try {
      localStorage.setItem('indiverse_user_version', CURRENT_USER_DATA_VERSION);
      localStorage.setItem('indiverse_user_data', JSON.stringify(fresh));
    } catch (e) {
      console.error(e);
    }
    return fresh;
  };

  return (
    <UserContext.Provider value={{
      userData,
      awardXp,
      updateUserProfile,
      claimDailyXp,
      completeCourse,
      resetUserData,
      isUserModalOpen,
      setIsUserModalOpen
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
