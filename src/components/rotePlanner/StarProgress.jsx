export function StarProgress({ planet, result }) {
    const max = Number(planet?.stars?.[3] ?? 0);

    const percentage = max
        ? Math.min(100, (result.totalPoints / max) * 100)
        : 0;

    return (
        <div className="star-progress">
            <div className="star-progress-header">
                <strong>
                    {result.stars} / 3 stars
                </strong>

                {result.nextStar ? (
                    <span>
                        {formatGP(result.pointsToNextStar)} to ⭐
                        {result.nextStar}
                    </span>
                ) : (
                    <span>Maximum stars reached</span>
                )}
            </div>

            <div className="progress-track">
                <div
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            <div className="star-thresholds">
                {[1, 2, 3].map(star => (
                    <span key={star}>
                        <b>{star}⭐</b>
                        <small>
                            {formatGP(planet?.stars?.[star] ?? 0)}
                        </small>
                    </span>
                ))}
            </div>
        </div>
    );
}

function formatGP(value) {
    return `${(Number(value) / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}M`;
}
