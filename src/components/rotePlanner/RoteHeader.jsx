export function RoteHeader({
    guildGP,
    projectedStars,
    targetStars,
    remainingGP,
}) {
    return (
        <header className="rote-header">
            <div>
                <div className="rote-eyebrow">Rise of the Empire</div>
                <h1>RoTE Strategy Planner</h1>
            </div>

            <div className="rote-header-stats">
                <div>
                    <span>Guild GP</span>
                    <strong>{formatGP(guildGP)}</strong>
                </div>

                <div>
                    <span>Projected</span>
                    <strong>⭐ {projectedStars}</strong>
                </div>

                <div>
                    <span>Target</span>
                    <strong>⭐ {targetStars}</strong>
                </div>

                <div>
                    <span>Remaining GP</span>
                    <strong>{formatGP(remainingGP)}</strong>
                </div>
            </div>
        </header>
    );
}

function formatGP(value) {
    return `${(Number(value) / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}M`;
}
