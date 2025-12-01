export interface DhikrType {
  id: string;
  name: string;
  nameUz: string;
  target?: number;
  arabic?: string;
}

export interface DhikrSession {
  dhikrTypeId: string;
  count: number;
  startTime: number;
  endTime?: number;
  date: string;
}

export interface DailyStats {
  date: string;
  sessions: DhikrSession[];
  totalCount: number;
  dhikrTypes: { [key: string]: number };
}

export interface UserData {
  userId: number;
  lastActivityDate?: string;
  totalLifetimeCount: number;
  dailyStats: { [date: string]: DailyStats };
  preferences: {
    reminderEnabled: boolean;
    reminderTime?: string;
    language: 'en' | 'uz';
  };
}

export const DHIKR_TYPES: DhikrType[] = [
  {
    id: 'subhanallah',
    name: 'Subhanallah',
    nameUz: 'Subhonalloh',
    target: 33,
    arabic: 'سُبْحَانَ ٱللَّٰهِ',
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    nameUz: 'Alhamdulillah',
    target: 33,
    arabic: 'ٱلْحَمْدُ لِلَّٰهِ',
  },
  {
    id: 'allahu-akbar',
    name: 'Allahu Akbar',
    nameUz: 'Allahu Akbar',
    target: 33,
    arabic: 'ٱللَّٰهُ أَكْبَرُ',
  },
  {
    id: 'la-ilaha-illallah',
    name: 'La ilaha illallah',
    nameUz: 'La ilaha illalloh',
    target: 100,
    arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ',
  },
  {
    id: 'astaghfirullah',
    name: 'Astaghfirullah',
    nameUz: 'Astagfirulloh',
    target: 100,
    arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ',
  },
  {
    id: 'salawat',
    name: 'Salawat',
    nameUz: 'Salavot',
    target: 100,
    arabic: 'ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
  },
  {
    id: 'custom',
    name: 'Custom Count',
    nameUz: 'Boshqa raqam',
    target: 99,
  },
];
