import { UserData, DailyStats, DhikrSession } from '../types/dhikr';

declare const Telegram: any;

export class CloudStorageManager {
  private static instance: CloudStorageManager;
  private cloudStorage: any;
  private userId: number = 0;
  private useTelegramStorage: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      this.cloudStorage = (window as any).Telegram.WebApp.CloudStorage;
      this.userId = (window as any).Telegram.WebApp.initDataUnsafe?.user?.id || 0;
      this.useTelegramStorage = true;
    }
  }

  public static getInstance(): CloudStorageManager {
    if (!CloudStorageManager.instance) {
      CloudStorageManager.instance = new CloudStorageManager();
    }
    return CloudStorageManager.instance;
  }

  public async getUserData(): Promise<UserData> {
    if (!this.useTelegramStorage) {
      return this.getUserDataFromLocalStorage();
    }

    return new Promise((resolve, reject) => {
      const key = `user_${this.userId}`;

      this.cloudStorage.getItem(key, (error: any, value: string) => {
        if (error) {
          console.error('Error getting user data:', error);
          reject(error);
          return;
        }

        if (!value) {
          const defaultData: UserData = {
            userId: this.userId,
            totalLifetimeCount: 0,
            dailyStats: {},
            preferences: {
              reminderEnabled: true,
              language: 'uz',
            },
          };
          resolve(defaultData);
          return;
        }

        try {
          const userData: UserData = JSON.parse(value);
          resolve(userData);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          reject(parseError);
        }
      });
    });
  }

  private getUserDataFromLocalStorage(): Promise<UserData> {
    return new Promise((resolve) => {
      const data = localStorage.getItem('userData');
      if (data) {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(this.getDefaultUserData());
        }
      } else {
        resolve(this.getDefaultUserData());
      }
    });
  }

  private getDefaultUserData(): UserData {
    return {
      userId: 0,
      totalLifetimeCount: 0,
      dailyStats: {},
      preferences: {
        reminderEnabled: true,
        language: 'uz',
      },
    };
  }

  public async saveUserData(userData: UserData): Promise<boolean> {
    if (!this.useTelegramStorage) {
      return this.saveUserDataToLocalStorage(userData);
    }

    return new Promise((resolve, reject) => {
      const key = `user_${this.userId}`;
      const value = JSON.stringify(userData);

      this.cloudStorage.setItem(key, value, (error: any, success: boolean) => {
        if (error) {
          console.error('Error saving user data:', error);
          reject(error);
          return;
        }
        resolve(success);
      });
    });
  }

  private saveUserDataToLocalStorage(userData: UserData): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        localStorage.setItem('userData', JSON.stringify(userData));
        resolve(true);
      } catch {
        resolve(false);
      }
    });
  }

  public async getTodayStats(): Promise<DailyStats | null> {
    const userData = await this.getUserData();
    const today = this.getTodayDate();
    return userData.dailyStats[today] || null;
  }

  public async addDhikrSession(session: DhikrSession): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      const dateKey = session.date;

      if (!userData.dailyStats[dateKey]) {
        userData.dailyStats[dateKey] = {
          date: dateKey,
          sessions: [],
          totalCount: 0,
          dhikrTypes: {},
        };
      }

      const dailyStats = userData.dailyStats[dateKey];

      dailyStats.sessions.push(session);
      dailyStats.totalCount += session.count;
      dailyStats.dhikrTypes[session.dhikrTypeId] =
        (dailyStats.dhikrTypes[session.dhikrTypeId] || 0) + session.count;

      userData.totalLifetimeCount += session.count;
      userData.lastActivityDate = dateKey;

      return await this.saveUserData(userData);
    } catch (error) {
      console.error('Error adding dhikr session:', error);
      return false;
    }
  }

  public async updateCurrentSessionCount(
    dhikrTypeId: string,
    count: number
  ): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      const today = this.getTodayDate();

      if (!userData.dailyStats[today]) {
        userData.dailyStats[today] = {
          date: today,
          sessions: [],
          totalCount: 0,
          dhikrTypes: {},
        };
      }

      const dailyStats = userData.dailyStats[today];

      let currentSession = dailyStats.sessions.find(
        s => s.dhikrTypeId === dhikrTypeId && !s.endTime
      );

      if (!currentSession) {
        currentSession = {
          dhikrTypeId,
          count: 0,
          startTime: Date.now(),
          date: today,
        };
        dailyStats.sessions.push(currentSession);
      }

      const diff = count - currentSession.count;

      currentSession.count = count;
      dailyStats.totalCount += diff;
      dailyStats.dhikrTypes[dhikrTypeId] =
        (dailyStats.dhikrTypes[dhikrTypeId] || 0) + diff;
      userData.totalLifetimeCount += diff;
      userData.lastActivityDate = today;

      return await this.saveUserData(userData);
    } catch (error) {
      console.error('Error updating session count:', error);
      return false;
    }
  }

  public async endCurrentSession(dhikrTypeId: string): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      const today = this.getTodayDate();

      if (!userData.dailyStats[today]) {
        return true;
      }

      const currentSession = userData.dailyStats[today].sessions.find(
        s => s.dhikrTypeId === dhikrTypeId && !s.endTime
      );

      if (currentSession) {
        currentSession.endTime = Date.now();
        return await this.saveUserData(userData);
      }

      return true;
    } catch (error) {
      console.error('Error ending session:', error);
      return false;
    }
  }

  public async getStatsForRange(
    startDate: string,
    endDate: string
  ): Promise<DailyStats[]> {
    try {
      const userData = await this.getUserData();
      const stats: DailyStats[] = [];

      Object.keys(userData.dailyStats)
        .filter(date => date >= startDate && date <= endDate)
        .sort()
        .forEach(date => {
          stats.push(userData.dailyStats[date]);
        });

      return stats;
    } catch (error) {
      console.error('Error getting stats for range:', error);
      return [];
    }
  }

  public async didDhikrToday(): Promise<boolean> {
    const todayStats = await this.getTodayStats();
    return todayStats !== null && todayStats.totalCount > 0;
  }

  public async getUserPreferences() {
    const userData = await this.getUserData();
    return userData.preferences;
  }

  public async updateUserPreferences(preferences: Partial<UserData['preferences']>): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      userData.preferences = {
        ...userData.preferences,
        ...preferences,
      };
      return await this.saveUserData(userData);
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }

  private getTodayDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  public async cleanupOldData(): Promise<boolean> {
    try {
      const userData = await this.getUserData();
      const today = new Date();
      const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
      const cutoffDate = ninetyDaysAgo.toISOString().split('T')[0];

      let hasChanges = false;
      Object.keys(userData.dailyStats).forEach(date => {
        if (date < cutoffDate) {
          delete userData.dailyStats[date];
          hasChanges = true;
        }
      });

      if (hasChanges) {
        return await this.saveUserData(userData);
      }

      return true;
    } catch (error) {
      console.error('Error cleaning up old data:', error);
      return false;
    }
  }
}

export default CloudStorageManager;
