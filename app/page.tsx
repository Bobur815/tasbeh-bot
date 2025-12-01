'use client';

import { useState, useEffect } from 'react';
import { DHIKR_TYPES, DhikrType } from '../types/dhikr';
import { CloudStorageManager } from '../services/CloudStorageManager';
import { translations } from '@/libs/translations';
import { RenderDhikrSelector } from '@/libs/renderDhikrSelector';
import { RenderStats } from '@/libs/renderStats';
import { RenderSettings } from '@/libs/renderSettings';

type Language = 'en' | 'uz';
type View = 'counter' | 'dhikr-selector' | 'stats' | 'settings';

export default function Home() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(99);
  const [showCompletion, setShowCompletion] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [customDhikrText, setCustomDhikrText] = useState(''); // For custom dhikr name
  const [language, setLanguage] = useState<Language>('uz');
  const [view, setView] = useState<View>('counter');
  const [selectedDhikr, setSelectedDhikr] = useState<DhikrType | null>(null);
  const [todayStats, setTodayStats] = useState<any>(null);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [totalLifetimeCount, setTotalLifetimeCount] = useState(0);

  const storage = CloudStorageManager.getInstance();

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
      const customName = selectedDhikr.id === 'custom' ? selectedDhikr.customName : undefined;
      await storage.updateCurrentSessionCount(selectedDhikr.id, count, customName);
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


  if (view === 'dhikr-selector') {
    return (
      <RenderDhikrSelector
        setView={setView}
        t={t}
        todayStats={todayStats}
        handleDhikrSelect={handleDhikrSelect}
        language={language}
      />
    );
  }

  if (view === 'stats') {
    return (
      <RenderStats
        setView={setView}
        t={t}
        todayStats={todayStats}
        totalLifetimeCount={totalLifetimeCount}
        language={language}
      />
    );
  }

  if (view === 'settings') {
    return (
      <RenderSettings
        setView={setView}
        t={t}
        toggleLanguage={toggleLanguage}
        language={language}
        toggleReminder={toggleReminder}
        reminderEnabled={reminderEnabled}
      />
    );
  }

  return (
    <>
      <div className="container">
        {/* Navigation Bar */}
        <div className="nav-bar">
          <div className="nav-button" onClick={() => setView('dhikr-selector')}>
            <span>🤲</span>
            {t.selectDhikr}
          </div>
          <div className="nav-button" onClick={() => setView('stats')}>
            <span>📊</span>
            {t.stats}
          </div>
          <div className="nav-button" onClick={() => setView('settings')}>
            <span>⚙️</span>
            {t.settings}
          </div>
        </div>

        {/* Selected Dhikr Display */}
        {selectedDhikr && (
          <div className="selected-dhikr">
            {selectedDhikr.id === 'custom' ? (
              selectedDhikr.customName ? (
                <div className="selected-dhikr-name">
                  {selectedDhikr.customName}
                </div>
              ) : (
                <div className="flex flex-col gap-2 items-center">
                  <input
                    type="text"
                    placeholder={language === 'en' ? 'Enter custom dhikr' : 'Zikr nomini kiriting'}
                    className='outline-none border-b-2 border-gray-300 focus:border-blue-500 px-2 py-1'
                    value={customDhikrText}
                    onChange={(e) => setCustomDhikrText(e.target.value)}
                  />
                  <button
                    className='text-blue-500 cursor-pointer hover:text-blue-600 font-semibold disabled:text-gray-400'
                    onClick={() => {
                      if (customDhikrText.trim()) {
                        setSelectedDhikr({
                          ...selectedDhikr,
                          customName: customDhikrText.trim()
                        });
                        setCustomDhikrText(''); // Clear input after saving
                      }
                    }}
                    disabled={!customDhikrText.trim()}
                  >
                    {t.save}
                  </button>
                </div>
              )
            ) : (
              <div className="selected-dhikr-name">
                {language === 'en' ? selectedDhikr.name : selectedDhikr.nameUz}
              </div>
            )}
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
              <img src="/icons8-retry-60.png" alt="" className='w-6 h-6' />
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
