import { ALIGNMENTS } from "../../rote-planner/data/rotePlannerDefaults";

export function PreloadPanel({
    phase,
    result,
}) {
    const rows = ALIGNMENTS
        .map(alignment => {
            const planet = phase?.[alignment];

            if (!planet) {
                return null;
            }

            const planetId = planet.planetId ?? planet.id;
            const planetResult = result?.planets?.[planetId];

            if (!planetResult?.deploymentGP || planetResult.stars > 0) {
                return null;
            }

            const threshold = Number(planet?.stars?.[1] ?? 0);

            return {
                alignment,
                planet,
                amount: planetResult.deploymentGP,
                threshold,
            };
        })
        .filter(Boolean);

    return (
        <section className="preload-panel">
            <div>
                <span className="rote-eyebrow">Carry forward</span>
                <h2>Preload</h2>
            </div>

            {rows.length === 0 ? (
                <p className="muted">
                    No current-phase deployment is being held below a
                    one-star threshold.
                </p>
            ) : (
                <div className="preload-list">
                    {rows.map(row => {
                        const percentage = row.threshold
                            ? Math.min(
                                100,
                                (row.amount / row.threshold) * 100
                            )
                            : 0;

                        return (
                            <div
                                className="preload-row"
                                key={row.planet.planetId ?? row.planet.id}
                            >
                                <div>
                                    <strong>
                                        {row.alignment} — {row.planet.name}
                                    </strong>
                                    <span>
                                        {formatGP(row.amount)} /{" "}
                                        {formatGP(row.threshold)}
                                    </span>
                                </div>

                                <div className="progress-track">
                                    <div
                                        className="preload-fill"
                                        style={{
                                            width: `${percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

function formatGP(value) {
    return `${(Number(value) / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}M`;
}
