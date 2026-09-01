function formatGP(value) {
    return `${(Number(value || 0) / 1_000_000).toFixed(1)}M`;
}

export function PhaseSummary({ phase, result }) {
    if (!phase || !result) return null;

    return (
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
    );
}
