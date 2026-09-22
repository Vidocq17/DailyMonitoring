export const command = `set -a; . "$HOME/Desktop/Repos/perso_deployed/DailyMonitoring/.env" 2>/dev/null; set +a; curl -s "$VITE_SUPABASE_URL/rest/v1/daily_monitoring?select=date_du_jour,pas,kcal,eau,poids,sport,cardio,abdos&date_du_jour=gte.$(date -v1d +%Y-%m-%d)&order=date_du_jour.asc" -H "apikey: $VITE_SUPABASE_KEY" -H "Authorization: Bearer $VITE_SUPABASE_KEY"`;

const OBJECTIF_POIDS = 75;

export const refreshFrequency = 5 * 60 * 1000;

export const className = `
  top: 375px;
  left: 85px;
  width: 304px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  color: rgba(28, 28, 30, 0.96);
  -webkit-font-smoothing: antialiased;

  * { box-sizing: border-box; }

  .card {
    width: 100%;
    padding: 15px 16px 14px;
    border-radius: 18px;
    background: rgba(246, 246, 248, 0.78);
    border: 1px solid rgba(255, 255, 255, 0.58);
    box-shadow: 0 10px 34px rgba(0, 0, 0, 0.12), inset 0 0 0 0.5px rgba(0, 0, 0, 0.04);
    backdrop-filter: blur(24px) saturate(145%);
    -webkit-backdrop-filter: blur(24px) saturate(145%);
  }

  .header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .title {
    font-size: 15px;
    line-height: 18px;
    font-weight: 650;
    letter-spacing: -0.18px;
    text-transform: capitalize;
  }

  .subtitle {
    font-size: 11px;
    line-height: 14px;
    font-weight: 600;
    color: rgba(60, 60, 67, 0.62);
    font-variant-numeric: tabular-nums;
  }

  .weight-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(118, 118, 128, 0.16);
  }

  .weight-value {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.3px;
    font-variant-numeric: tabular-nums;
  }

  .weight-value .unit {
    font-size: 12px;
    font-weight: 600;
    color: rgba(60, 60, 67, 0.5);
    margin-left: 2px;
  }

  .weight-goal {
    text-align: right;
    font-size: 10px;
    line-height: 13px;
    color: rgba(60, 60, 67, 0.55);
  }

  .weight-delta {
    display: block;
    font-size: 12px;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }

  .weight-delta.reached { color: #248a3d; }
  .weight-delta.pending { color: rgba(28, 28, 30, 0.85); }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    margin-bottom: 4px;
  }

  .weekday {
    text-align: center;
    font-size: 9px;
    font-weight: 650;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    color: rgba(60, 60, 67, 0.45);
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
  }

  .day {
    aspect-ratio: 1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1px;
    background: rgba(118, 118, 128, 0.08);
  }

  .day.empty { background: transparent; }

  .day .num {
    font-size: 9px;
    font-weight: 600;
    color: rgba(60, 60, 67, 0.5);
    font-variant-numeric: tabular-nums;
  }

  .day .mark { font-size: 12px; line-height: 1; }

  .day.ok { background: rgba(52, 199, 89, 0.16); }
  .day.ok .num { color: rgba(36, 138, 61, 0.9); }

  .day.miss { background: rgba(255, 69, 58, 0.10); }
  .day.miss .num { color: rgba(191, 41, 30, 0.75); }

  .day.today { box-shadow: inset 0 0 0 1.5px rgba(10, 132, 255, 0.7); }

  .empty-state {
    padding: 4px 0 2px;
    font-size: 11px;
    line-height: 16px;
    color: rgba(60, 60, 67, 0.64);
  }

  @media (prefers-color-scheme: dark) {
    color: rgba(242, 242, 247, 0.96);

    .card {
      background: rgba(28, 28, 30, 0.78);
      border-color: rgba(255, 255, 255, 0.10);
      box-shadow: 0 12px 38px rgba(0, 0, 0, 0.28), inset 0 0 0 0.5px rgba(255, 255, 255, 0.03);
    }

    .subtitle, .weekday { color: rgba(235, 235, 245, 0.55); }
    .weight-row { border-bottom-color: rgba(235, 235, 245, 0.14); }
    .weight-value .unit, .weight-goal { color: rgba(235, 235, 245, 0.5); }
    .weight-delta.reached { color: #4ade80; }
    .weight-delta.pending { color: rgba(242, 242, 247, 0.9); }
    .day { background: rgba(118, 118, 128, 0.18); }
    .day .num { color: rgba(235, 235, 245, 0.55); }
    .day.ok { background: rgba(48, 209, 88, 0.20); }
    .day.ok .num { color: rgba(48, 209, 88, 0.95); }
    .day.miss { background: rgba(255, 69, 58, 0.16); }
    .day.miss .num { color: rgba(255, 105, 97, 0.9); }
    .empty-state { color: rgba(235, 235, 245, 0.62); }
  }
`;

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// jour "valide" = tous les éléments trackés sont renseignés/faits ce jour-là
const estValide = (j) =>
	j.sport === true &&
	j.cardio === true &&
	j.abdos === true &&
	j.pas != null &&
	j.kcal != null &&
	j.eau != null &&
	j.poids != null;

export const render = ({ output, error }) => {
	const now = new Date();
	const moisLabel = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
	const today = now.getDate();
	const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

	let rows = [];
	if (!error && output) {
		try {
			rows = JSON.parse(output.trim() || '[]');
		} catch (_) {
			rows = [];
		}
	}

	const parJour = {};
	for (const j of rows) {
		parJour[Number(j.date_du_jour.slice(-2))] = j;
	}

	const total = rows.filter(estValide).length;

	const dernierPoids = [...rows].reverse().find((j) => j.poids != null)?.poids ?? null;
	const delta = dernierPoids != null ? Math.round((dernierPoids - OBJECTIF_POIDS) * 10) / 10 : null;

	// premier jour du mois: 0 = lundi ... 6 = dimanche, pour aligner la grille
	const firstWeekday = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
	const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

	return (
		<div className="card">
			<div className="header">
				<div className="title">Daily Monitoring · {moisLabel}</div>
				<div className="subtitle">{total}/{today}</div>
			</div>

			{error || !Array.isArray(rows) ? (
				<div className="empty-state">Connexion à Supabase impossible.</div>
			) : (
				<div>
					<div className="weight-row">
						<div className="weight-value">
							{dernierPoids != null ? dernierPoids : '—'}
							<span className="unit">kg</span>
						</div>
						<div className="weight-goal">
							Objectif {OBJECTIF_POIDS} kg
							{delta != null && (
								<span className={`weight-delta ${delta <= 0 ? 'reached' : 'pending'}`}>
									{delta <= 0 ? 'atteint ✅' : `-${delta} kg`}
								</span>
							)}
						</div>
					</div>
					<div className="weekdays">
						{WEEKDAYS.map((w, i) => (
							<div className="weekday" key={i}>{w}</div>
						))}
					</div>
					<div className="grid">
						{cells.map((d, i) => {
							if (d === null) return <div className="day empty" key={i} />;
							const j = parJour[d];
							let cls = 'day';
							let mark = '';
							if (j) {
								if (estValide(j)) {
									cls += ' ok';
									mark = '✅';
								} else {
									cls += ' miss';
									mark = '❌';
								}
							} else if (d < today) {
								cls += ' miss';
								mark = '❓';
							}
							if (d === today) cls += ' today';
							return (
								<div className={cls} key={i}>
									<span className="num">{d}</span>
									<span className="mark">{mark}</span>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
