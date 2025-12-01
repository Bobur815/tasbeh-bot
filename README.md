# Tasbeh Bot - Digital Dhikr Counter 🤲

A beautiful, feature-rich digital dhikr counter with bilingual support, cloud storage, and daily statistics. Perfect for tracking your daily remembrance of Allah.

## ✨ Features

- 🌍 **Bilingual Support**: English & Uzbek (default: Uzbek)
- 🤲 **Multiple Dhikr Types**: Subhanallah, Alhamdulillah, Allahu Akbar, and more
- 📊 **Daily Statistics**: Track your progress and lifetime totals
- ☁️ **Cloud Storage**: Telegram Cloud Storage integration with localStorage fallback
- 🔔 **Notification Settings**: Daily reminder toggles
- 🎯 **Custom Targets**: Set your own goals or use predefined targets (33, 99, 100)
- 📱 **Mobile Optimized**: Haptic feedback, large buttons, responsive design
- 🎨 **Beautiful UI**: Elegant Islamic-inspired design with teal & gold theme

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📖 Usage

### Counter View
1. Select a dhikr type from the navigation
2. Tap the large + button to count
3. Your progress is saved automatically
4. Reset when you reach your target

### Dhikr Selector
- Browse 6+ predefined dhikr types with Arabic text
- See today's progress for each type
- Visual progress bars

### Statistics
- View today's total and lifetime counts
- Breakdown by dhikr type
- Track your consistency

### Settings
- Switch between English and Uzbek
- Toggle daily reminders
- All preferences saved automatically

## 🏗️ Project Structure

```
tasbeh-bot/
├── app/
│   ├── page.tsx          # Main app with all views
│   ├── layout.tsx        # Root layout
│   └── globals.css       # All styles
├── types/
│   └── dhikr.ts         # TypeScript interfaces
├── services/
│   └── CloudStorageManager.ts  # Cloud storage
└── public/
    └── icons8-retry-60.png
```

## 🛠️ Built With

- **Next.js 16** - React framework with Turbopack
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Telegram WebApp API** - Cloud storage integration

## 📋 Available Dhikr Types

1. **Subhanallah** (سُبْحَانَ ٱللَّٰهِ) - Target: 33
2. **Alhamdulillah** (ٱلْحَمْدُ لِلَّٰهِ) - Target: 33
3. **Allahu Akbar** (ٱللَّٰهُ أَكْبَرُ) - Target: 33
4. **La ilaha illallah** (لَا إِلَٰهَ إِلَّا ٱللَّٰهُ) - Target: 100
5. **Astaghfirullah** (أَسْتَغْفِرُ ٱللَّٰهَ) - Target: 100
6. **Salawat** (ٱللَّٰهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ) - Target: 100
7. **Custom Count** - Set your own target

## 🔄 Data Storage

The app uses a dual-storage system:
- **Primary**: Telegram Cloud Storage (when running in Telegram)
- **Fallback**: Browser localStorage (for web use)
- All data syncs automatically
- Keeps 90 days of history

## 🎯 Future Enhancements

- Telegram Bot integration for notifications
- Weekly and monthly reports
- Streak tracking
- Custom dhikr types
- Social features

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 Documentation

For detailed features and technical documentation, see [FEATURES.md](./FEATURES.md)

## 🔧 Development

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌟 Acknowledgments

Built with ❤️ for the Muslim community

---

**May Allah accept all your dhikr! 🤲**
