export function OperationSelector({
    selected = [],
    available = [],
    operationPoints = {},
    onChange,
}) {
    function toggle(id) {
        if (!available.includes(id)) {
            return;
        }

        const next = selected.includes(id)
            ? selected.filter(operationId => operationId !== id)
            : [...selected, id];

        onChange(next);
    }

    return (
        <div className="operation-selector">
            <label>Operations</label>

            <div className="operation-grid">
                {[1, 2, 3, 4, 5, 6].map(id => {
                    const isAvailable = available.includes(id);
                    const isSelected = selected.includes(id);

                    return (
                        <button
                            key={id}
                            type="button"
                            disabled={!isAvailable}
                            className={isSelected ? "selected" : ""}
                            onClick={() => toggle(id)}
                            title={
                                isAvailable
                                    ? `Operation ${id}`
                                    : "Not available to this guild"
                            }
                        >
                            <span>OP {id}</span>
                            {operationPoints[id] ? (
                                <small>
                                    {formatMillions(operationPoints[id])}
                                </small>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function formatMillions(value) {
    return `${Number(value) / 1_000_000}M`;
}
