import { DHIKR_TYPES, DhikrType } from "@/types/dhikr";

type Language = 'en' | 'uz';
type View = 'counter' | 'dhikr-selector' | 'stats' | 'settings';

interface RenderDhikrSelectorProps {
  setView: (view: View) => void;
  t: any;
  todayStats: any;
  handleDhikrSelect: (dhikr: DhikrType) => void;
  language: Language;
}

export const RenderDhikrSelector = ({
  setView,
  t,
  todayStats,
  handleDhikrSelect,
  language
}: RenderDhikrSelectorProps) => (
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