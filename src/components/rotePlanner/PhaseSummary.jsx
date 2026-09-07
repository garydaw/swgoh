function formatGP(value) {
    return `${(Number(value || 0) / 1_000_000).toFixed(1)}M`;
}

export function PhaseSummary({
    phase,
    result,
    projectedStars,
    targetStars,
}) {
    if (!phase || !result) return null;

    const remainingGP = Number(result.remainingGP ?? 0);
    const usedGP = Number(result.totalAllocatedGP ?? 0);

    return (
        <div className="phase-summary">
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
                <strong>{formatGP(result.totalDeploymentGP)}</strong>
            </div>

            <div>
                <span>Preload created</span>
                <strong>{formatGP(result.totalPreload)}</strong>
            </div>

            <div>
                <span>Projected Stars</span>
                <strong>{projectedStars} / {targetStars}</strong>
            </div>

            <div>
                <span>GP Used</span>
                <strong>{formatGP(usedGP)}</strong>
            </div>

            <div>
                <span>GP Remaining</span>
                <strong>{formatGP(remainingGP)}</strong>
            </div>
        </div>
    );
}
