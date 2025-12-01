import { DHIKR_TYPES } from "@/types/dhikr";

type Language = 'en' | 'uz';
type View = 'counter' | 'dhikr-selector' | 'stats' | 'settings';

interface RenderStatsProps {
  setView: (view: View) => void;
  t: any;
  todayStats: any;
  totalLifetimeCount: number;
  language: Language;
}

export const RenderStats = ({
  setView,
  t,
  todayStats,
  totalLifetimeCount,
  language
}: RenderStatsProps) => (
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

            // Get custom name if it's a custom dhikr
            const customName = dhikrId === 'custom' && todayStats.customDhikrNames
              ? todayStats.customDhikrNames[dhikrId]
              : null;

            // Determine display name
            const displayName = customName
              || (dhikr ? (language === 'en' ? dhikr.name : dhikr.nameUz) : dhikrId);

            return (
              <div key={dhikrId} className="breakdown-item">
                <span className="breakdown-name">
                  {displayName}
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