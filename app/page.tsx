'use client';

import { useState, useEffect } from 'react';
import { DHIKR_TYPES, DhikrType } from '../types/dhikr';
import { CloudStorageManager } from '../services/CloudStorageManager';

type Language = 'en' | 'uz';
type View = 'counter' | 'dhikr-selector' | 'stats' | 'settings';

export default function Home() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(99);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [language, setLanguage] = useState<Language>('uz');
  const [view, setView] = useState<View>('counter');
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrType | null>(null);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [totalLifetimeCount, setTotalLifetimeCount] = useState(0);

  const storage = CloudStorageManager.getInstance();

  const translations = {
    en: {
      targetLabel: 'Select Target',
      count33: '33 count',
      count99: '99 count',
      count100: '100 count',
      customCount: 'Custom count',
      enterNumber: 'Enter number',
      resetConfirm: 'Do you want to restart counting?',
      completionTitle: 'Subhanalloh!',
      completionText: 'You have reached your target!',
      continue: 'Continue',
      selectDhikr: 'Select Dhikr',
      stats: 'Statistics',
      settings: 'Settings',
      back: 'Back',
      todayStats: "Today's Statistics",
      todayTotal: 'Total today',
      lifetimeTotal: 'Lifetime total',
      noStatsToday: 'No dhikr counted today. Start counting!',
      languageSetting: 'Language',
      notificationSetting: 'Daily Reminder',
      enabled: 'Enabled',
      disabled: 'Disabled',
      dhikrTypes: 'Dhikr Types',
      today: 'Today',
      target: 'Target',
    },
    uz: {
      targetLabel: 'Maqsad tanlang',
      count33: '33 dona',
      count99: '99 dona',
      count100: '100 dona',
      customCount: 'Boshqa raqam',
      enterNumber: 'Raqamni kiriting',
      resetConfirm: 'Hisoblashni qayta boshlashni xohlaysizmi?',
      completionTitle: 'Subhonalloh!',
      completionText: 'Siz maqsadga yetdingiz!',
      continue: 'Davom ettirish',
      selectDhikr: 'Zikr tanlash',
      stats: 'Statistika',
      settings: 'Sozlamalar',
      back: 'Orqaga',
      todayStats: 'Bugungi statistika',
      todayTotal: 'Bugun jami',
      lifetimeTotal: 'Umumiy jami',
      noStatsToday: 'Bugun hali zikr qilinmagan. Boshlang!',
      languageSetting: 'Til',
      notificationSetting: 'Kunlik eslatma',
      enabled: 'Yoqilgan',
      disabled: "O'chirilgan",
      dhikrTypes: 'Zikr turlari',
      today: 'Bugun',
      target: 'Maqsad',
    },
  };

  const t = translations[language];

  useEffect(() => {
    loadUserPreferences();
    loadTodayStats();
  }, []);

  useEffect(() => {
    const savedCount = localStorage.getItem('last_count');
    if (savedCount !== null) {
      setCount(parseInt(savedCount));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('last_count', count.toString());
    if (count > 0) {
      updateCloudStorage();
    }
  }, [count]);

  useEffect(() => {
    if (count === target && count > 0) {
      setShowCompletion(true);
    }
  }, [count, target]);

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.body.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      document.body.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const loadUserPreferences = async () => {
    try {
      const prefs = await storage.getUserPreferences();
      setLanguage(prefs.language || 'uz');
      setReminderEnabled(prefs.reminderEnabled);

      const userData = await storage.getUserData();
      setTotalLifetimeCount(userData.totalLifetimeCount);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadTodayStats = async () => {
    try {
      const stats = await storage.getTodayStats();
      setTodayStats(stats);
    } catch (error) {
      console.error('Error loading today stats:', error);
    }
  };

  const updateCloudStorage = async () => {
    if (selectedDhikr) {
      await storage.updateCurrentSessionCount(selectedDhikr.id, count);
      await loadTodayStats();
      const userData = await storage.getUserData();
      setTotalLifetimeCount(userData.totalLifetimeCount);
    }
  };

  const hapticFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleIncrease = () => {
    setCount(count + 1);
    hapticFeedback();
  };

  const handleDecrease = () => {
    if (count > 0) {
      setCount(count - 1);
      hapticFeedback();
    }
  };

  const handleReset = () => {
    if (confirm(t.resetConfirm)) {
      setCount(0);
      localStorage.removeItem('last_count');
      hapticFeedback();
    }
  };

  const handleContinue = () => {
    setShowCompletion(false);
    setCount(0);
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setTarget(parseInt(value));
    }
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    const numValue = parseInt(value);
    if (numValue > 0) {
      setTarget(numValue);
    }
  };

  const handleOverlayClick = () => {
    setShowCompletion(false);
  };

  const handleDhikrSelect = (dhikr: DhikrType) => {
    setSelectedDhikr(dhikr);
    if (dhikr.target) {
      setTarget(dhikr.target);
    }
    setView('counter');
  };

  const toggleLanguage = async () => {
    const newLang = language === 'en' ? 'uz' : 'en';
    setLanguage(newLang);
    await storage.updateUserPreferences({ language: newLang });
  };

  const toggleReminder = async () => {
    const newValue = !reminderEnabled;
    setReminderEnabled(newValue);
    await storage.updateUserPreferences({ reminderEnabled: newValue });
  };

  const renderDhikrSelector = () => (
    <div className="dhikr-selector-view">
      <div className="view-header">
        <button className="back-button" onClick={() => setView('counter')}>
          ← {t.back}
        </button>
        <h2>{t.selectDhikr}</h2>
      </div>
      <div className="dhikr-list">
        {DHIKR_TYPES.map((dhikr) => {
          const todayCount = todayStats?.dhikrTypes[dhikr.id] || 0;
          const progress = dhikr.target ? (todayCount / dhikr.target) * 100 : 0;

          return (
            <div
              key={dhikr.id}
              className="dhikr-card"
              onClick={() => handleDhikrSelect(dhikr)}
            >
              <div className="dhikr-info">
                <div className="dhikr-name">
                  {language === 'en' ? dhikr.name : dhikr.nameUz}
                </div>
                {dhikr.arabic && (
                  <div className="dhikr-arabic">{dhikr.arabic}</div>
                )}
              </div>
              <div className="dhikr-stats">
                <span className="stat-label">{t.today}:</span>
                <span className="stat-value">{todayCount}</span>
                {dhikr.target && (
                  <>
                    <span className="stat-separator">/</span>
                    <span className="stat-target">{dhikr.target}</span>
                  </>
                )}
              </div>
              {dhikr.target && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="stats-view">
      <div className="view-header">
        <button className="back-button" onClick={() => setView('counter')}>
          ← {t.back}
        </button>
        <h2>{t.stats}</h2>
      </div>
      <div className="stats-content">
        <div className="stats-card">
          <div className="stats-label">{t.todayTotal}</div>
          <div className="stats-value">{todayStats?.totalCount || 0}</div>
        </div>
        <div className="stats-card">
          <div className="stats-label">{t.lifetimeTotal}</div>
          <div className="stats-value">{totalLifetimeCount}</div>
        </div>
        {todayStats && todayStats.totalCount > 0 ? (
          <div className="dhikr-breakdown">
            <h3>{t.dhikrTypes}</h3>
            {Object.entries(todayStats.dhikrTypes).map(([dhikrId, count]: [string, any]) => {
              const dhikr = DHIKR_TYPES.find(d => d.id === dhikrId);
              return (
                <div key={dhikrId} className="breakdown-item">
                  <span className="breakdown-name">
                    {dhikr ? (language === 'en' ? dhikr.name : dhikr.nameUz) : dhikrId}
                  </span>
                  <span className="breakdown-count">{count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-stats">{t.noStatsToday}</div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-view">
      <div className="view-header">
        <button className="back-button" onClick={() => setView('counter')}>
          ← {t.back}
        </button>
        <h2>{t.settings}</h2>
      </div>
      <div className="settings-content">
        <div className="setting-item">
          <div className="setting-label">{t.languageSetting}</div>
          <button className="setting-toggle" onClick={toggleLanguage}>
            {language === 'en' ? '🇬🇧 English' : '🇺🇿 O\'zbekcha'}
          </button>
        </div>
        <div className="setting-item">
          <div className="setting-label">{t.notificationSetting}</div>
          <button className="setting-toggle" onClick={toggleReminder}>
            {reminderEnabled ? `✅ ${t.enabled}` : `❌ ${t.disabled}`}
          </button>
        </div>
      </div>
    </div>
  );

  if (view === 'dhikr-selector') {
    return renderDhikrSelector();
  }

  if (view === 'stats') {
    return renderStats();
  }

  if (view === 'settings') {
    return renderSettings();
  }

  return (
    <>
      <div className="container">
        {/* Navigation Bar */}
        <div className="nav-bar">
          <button className="nav-button" onClick={() => setView('dhikr-selector')}>
            🤲 {t.selectDhikr}
          </button>
          <button className="nav-button" onClick={() => setView('stats')}>
            📊 {t.stats}
          </button>
          <button className="nav-button" onClick={() => setView('settings')}>
            ⚙️ {t.settings}
          </button>
        </div>

        {/* Selected Dhikr Display */}
        {selectedDhikr && (
          <div className="selected-dhikr">
            <div className="selected-dhikr-name">
              {language === 'en' ? selectedDhikr.name : selectedDhikr.nameUz}
            </div>
            {selectedDhikr.arabic && (
              <div className="selected-dhikr-arabic">{selectedDhikr.arabic}</div>
            )}
          </div>
        )}

        {/* Main Counter Display */}
        <div className="counter-display">
          <div className="count-number">{count}</div>
          <div className="count-label">/ {target}</div>
        </div>

        {/* Target Selector */}
        <div className="target-selector">
          <div className="target-label">{t.targetLabel}</div>
          <div className="select-wrapper">
            <select onChange={handleTargetChange} defaultValue="99" className={showCustomInput ? 'has-custom' : ''}>
              <option value="33">{t.count33}</option>
              <option value="99">{t.count99}</option>
              <option value="100">{t.count100}</option>
              <option value="custom">{t.customCount}</option>
            </select>
          </div>
          {showCustomInput && (
            <div className="custom-input-wrapper">
              <input
                type="number"
                id='customInput'
                className="custom-input"
                min="1"
                placeholder={t.enterNumber}
                value={customValue}
                onChange={handleCustomInput}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Interaction Zone */}
        <div className="interaction-zone">
          {/* Big Dhikr Button */}
          <button
            className="big-dhikr-button"
            onClick={handleIncrease}
            aria-label="Zikr qo'shish"
          >
            <span className="button-icon">+</span>
          </button>

          {/* Secondary Buttons */}
          <div className="secondary-buttons">
            <button className="btn-decrease" onClick={handleDecrease}>
              − 1
            </button>
            <button className="btn-decrease" onClick={handleReset}>
              <img src="/icons8-retry-60.png" alt="" className='w-6 h-6'/>
            </button>
          </div>
        </div>
      </div>

      {/* Completion Message */}
      <div
        className={`overlay ${showCompletion ? 'show' : ''}`}
        onClick={handleOverlayClick}
      />
      <div className={`completion-message ${showCompletion ? 'show' : ''}`}>
        <h2>{t.completionTitle} 🤲</h2>
        <p>{t.completionText}</p>
        <button onClick={handleContinue}>{t.continue}</button>
      </div>
    </>
  );
}
