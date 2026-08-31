export function PointBreakdown({ result }) {
    return (
        <div className="point-breakdown">
            <div>
                <span className="ops">Operations</span>
                <strong>{formatGP(result.operationsPoints)}</strong>
            </div>

            <div>
                <span className="missions">Missions</span>
                <strong>{formatGP(result.missionPoints)}</strong>
            </div>

            <div>
                <span className="deployment">Deployment</span>
                <strong>{formatGP(result.deploymentGP)}</strong>
            </div>

            {result.preloadGP > 0 ? (
                <div>
                    <span className="preload">Preload</span>
                    <strong>{formatGP(result.preloadGP)}</strong>
                </div>
            ) : null}

            <div className="point-total">
                <span>Total</span>
                <strong>{formatGP(result.totalPoints)}</strong>
            </div>
        </div>
    );
}

function formatGP(value) {
    return `${(Number(value) / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}M`;
}
