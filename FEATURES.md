# Tasbeh Bot - Integrated Features

This project combines features from both tasbeh-bot projects into a single, comprehensive digital dhikr counter application.

## Features

### 1. Bilingual Support (English & Uzbek)
- **Default Language**: Uzbek (O'zbekcha)
- **Switchable Interface**: Users can toggle between English and Uzbek
- **Persistent Settings**: Language preference is saved to cloud storage
- All UI elements, labels, and messages are fully translated

### 2. Dhikr Selector
- **Predefined Dhikr Types**:
  - Subhanallah (سُبْحَانَ ٱللَّٰهِ) - Target: 33
  - Alhamdulillah (ٱلْحَمْدُ لِلَّٰهِ) - Target: 33
  - Allahu Akbar (ٱللَّٰهُ أَكْبَرُ) - Target: 33
  - La ilaha illallah (لَا إِلَٰهَ إِلَّا ٱللَّٰهُ) - Target: 100
  - Astaghfirullah (أَسْتَغْفِرُ ٱللَّٰهَ) - Target: 100
  - Salawat (ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ) - Target: 100
  - Custom Count - User-defined target

- **Features**:
  - Display Arabic text for each dhikr
  - Show today's count and progress for each dhikr type
  - Visual progress bars
  - Easy selection interface

### 3. Daily Statistics
- **Today's Stats**:
  - Total count for today
  - Breakdown by dhikr type
  - Progress tracking

- **Lifetime Stats**:
  - Total lifetime dhikr count
  - Persistent across sessions
  - Synced to cloud storage

### 4. Telegram Cloud Storage Manager
- **Automatic Sync**: All data is synced to Telegram Cloud Storage when available
- **Fallback to LocalStorage**: Works offline with localStorage when Telegram is not available
- **Data Tracked**:
  - User preferences (language, reminder settings)
  - Daily statistics
  - Lifetime counts
  - Session history

- **Data Management**:
  - Automatic cleanup of data older than 90 days
  - Efficient storage using JSON format
  - Per-user data isolation

### 5. Notification Settings
- **Daily Reminder Toggle**: Enable/disable daily reminders
- **Persistent Settings**: Reminder preferences saved to cloud
- **Telegram Integration Ready**: Ready for bot integration to send actual notifications

### 6. Target Setting
- **Quick Targets**: 33, 99, 100 counts
- **Custom Target**: Enter any number
- **Automatic Updates**: Target auto-set when selecting predefined dhikr types
- **Visual Progress**: Counter shows current/target ratio

### 7. Counter Features (Maintained from Original)
- **Haptic Feedback**: Vibration on each count (mobile devices)
- **Increment/Decrement**: +1 and -1 buttons
- **Reset Function**: Clear count with confirmation
- **Completion Notification**: Alert when target is reached
- **Persistent Count**: Saves count to localStorage
- **Prevent Pull-to-Refresh**: Better mobile experience

### 8. Design
- **Maintained Original Design**: All original styling preserved
- **Teal & Gold Theme**: Elegant Islamic-inspired color scheme
- **Responsive**: Works on all screen sizes
- **Touch-Optimized**: Large buttons for easy mobile use
- **Smooth Animations**: Polished user experience

## File Structure

```
tasbeh-bot/
├── app/
│   ├── page.tsx          # Main app component with all views
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # All styles including new components
├── types/
│   └── dhikr.ts         # TypeScript interfaces and dhikr types
├── services/
│   └── CloudStorageManager.ts  # Cloud storage management
└── public/
    └── icons8-retry-60.png    # Reset icon
```

## Usage

### Counter View (Default)
- Select a dhikr type from the navigation
- Tap the large + button to count
- Use -1 to decrease if needed
- Reset to start over
- View stats and settings from navigation bar

### Dhikr Selector View
- Browse available dhikr types
- See today's progress for each type
- Tap to select and start counting

### Statistics View
- View today's total count
- See lifetime total across all sessions
- Breakdown by dhikr type
- Track your consistency

### Settings View
- Change language (English/Uzbek)
- Toggle daily reminders
- Preferences saved automatically

## Technical Features

### TypeScript Support
- Full type safety
- Defined interfaces for all data structures
- Type-safe state management

### Storage System
- **Telegram Cloud Storage**: Primary storage when in Telegram
- **LocalStorage**: Fallback for web use
- **Automatic Sync**: Changes saved immediately
- **Error Handling**: Graceful fallbacks

### Performance
- Next.js 16 with Turbopack
- Optimized static generation
- Fast page loads
- Efficient re-renders

## Future Enhancements (Ready to Implement)

1. **Telegram Bot Integration**:
   - Commands from tasbeh-bot (2) ready to use
   - /start, /help, /stats, /settings, /reminder
   - Bot notification service available

2. **Advanced Analytics**:
   - Weekly reports
   - Streak tracking
   - Most used dhikr analysis

3. **Social Features**:
   - Share achievements
   - Group dhikr sessions
   - Leaderboards

4. **Customization**:
   - Custom dhikr types
   - Personalized targets
   - Theme options

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Technologies Used

- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS
- **Telegram WebApp API**: Cloud storage integration
- **localStorage**: Offline support

## Notes

- Language defaults to Uzbek as requested
- All original design maintained
- Cloud storage works both in Telegram and standalone
- Fully responsive and mobile-optimized
- Production-ready build
