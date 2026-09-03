function formatGP(value) {
    return `${(Number(value || 0) / 1_000_000).toFixed(1)}M`;
}

export function PhaseSummary({
    phase,
    result,
    guildGP,
    projectedStars,
    targetStars }) {
    if (!phase || !result) return null;

    return (
        <div className="phase-summary">
            <div className="phase-summary__main">
                <section className="phase-summary">
                    <div>
                        <span>Phase</span>
                        <strong>{phase.id}</strong>
                    </div>

                    <div>
                        <span>Stars</span>
                        <strong>{result.stars} / 9 ⭐</strong>
                    </div>

                    <div>
                        <span>Deployment</span>
                        <strong>{formatGP(result.totalDeployment)}</strong>
                    </div>

                    <div>
                        <span>Preload</span>
                        <strong>{formatGP(result.totalPreload)}</strong>
                    </div>
                </section>
            </div>

            <div className="phase-summary__planner">
                <section className="phase-summary">
                    <div>
                        <span>Projected Stars</span>
                        <strong>{projectedStars} / {targetStars}</strong>
                    </div>

                    <div>
                        <span>GP Used</span>
                        <strong>{formatGP(guildGP - result.remainingGP)}</strong>
                    </div>

                    <div>
                        <span>GP Remaining</span>
                        <strong>{formatGP(result.remainingGP)}</strong>
                    </div>
                </section>
            </div>
        </div>
    );
}
