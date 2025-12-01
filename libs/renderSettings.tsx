type Language = 'en' | 'uz';
type View = 'counter' | 'dhikr-selector' | 'stats' | 'settings';

interface RenderSettingsProps {
  setView: (view: View) => void;
  t: any;
  toggleLanguage: () => void;
  language: Language;
  toggleReminder: () => void;
  reminderEnabled: boolean;
}

export const RenderSettings = ({
  setView,
  t,
  toggleLanguage,
  language,
  toggleReminder,
  reminderEnabled
}: RenderSettingsProps) => (
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