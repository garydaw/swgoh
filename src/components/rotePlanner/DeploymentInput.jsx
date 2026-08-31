export function DeploymentInput({
    value = 0,
    max = 0,
    onChange,
}) {
    const safeMax = Math.max(0, Number(max));
    const safeValue = Math.min(
        safeMax,
        Math.max(0, Number(value))
    );

    return (
        <div className="planner-field">
            <div className="field-heading">
                <label htmlFor="deployment-gp">
                    Deployment GP
                </label>

                <input
                    className="deployment-number"
                    type="number"
                    min="0"
                    max={safeMax}
                    step="1000000"
                    value={value}
                    onChange={event =>
                        onChange(Number(event.target.value) || 0)
                    }
                />
            </div>

            <input
                id="deployment-gp"
                type="range"
                min="0"
                max={safeMax || 1}
                step="1000000"
                value={safeValue}
                onChange={event =>
                    onChange(Number(event.target.value))
                }
            />

            <div className="range-labels">
                <span>0</span>
                <span>{formatGP(safeMax)}</span>
            </div>
        </div>
    );
}

function formatGP(value) {
    return `${(Number(value) / 1_000_000).toLocaleString()}M`;
}
