function formatGP(value) {
    return `${(Number(value || 0) / 1_000_000).toFixed(1)}M`;
}

export function RoteHeader({
    guildGP,
    projectedStars,
    targetStars,
    remainingGP,
}) {
    return (
        <header className="rote-header">
            <div>
                <h1>RoTE Strategy Planner</h1>
                <p>Plan your guild's RoTE strategy.</p>
            </div>

            <div className="rote-header__stats">
                <div className="rote-stat">
                    <span>Guild GP</span>
                    <strong>{formatGP(guildGP)}</strong>
                </div>

                <div className="rote-stat">
                    <span>Projected Stars</span>
                    <strong>{projectedStars} / {targetStars}</strong>
                </div>

                <div className="rote-stat">
                    <span>GP Used</span>
                    <strong>{formatGP(guildGP - remainingGP)}</strong>
                </div>

                <div className="rote-stat">
                    <span>GP Remaining</span>
                    <strong>{formatGP(remainingGP)}</strong>
                </div>
            </div>
        </header>
    );
}
