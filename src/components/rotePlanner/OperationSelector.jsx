import { OPERATION_IDS } from "../../helpers/rotePlannerDefaults";

function formatGP(value) {
    const millions = Number(value || 0) / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2)}M`;
}

export function OperationSelector({
    selected = [],
    available = [],
    operationValues = {},
    planetLevel,
    onChange,
}) {
    function toggle(operation) {
        if (!available.includes(operation)) return;

        const next = selected.includes(operation)
            ? selected.filter((item) => item !== operation)
            : [...selected, operation].sort((a, b) => a - b);

        onChange(next);
    }

    return (
        <div className="operation-grid">
            {OPERATION_IDS.map((operation) => {
                const availableForPlanet = available.includes(operation);
                const isSelected = selected.includes(operation);

                return (
                    <button
                        key={operation}
                        type="button"
                        disabled={!availableForPlanet}
                        className={`operation-button ${
                            isSelected ? "is-selected" : ""
                        } ${!availableForPlanet ? "is-disabled" : ""}`}
                        onClick={() => toggle(operation)}
                    >
                        <span>{availableForPlanet ? "OP" : "🔒 OP"} {operation}</span>
                        <strong>
                            {formatGP(operationValues[String(planetLevel)])}
                        </strong>
                    </button>
                );
            })}
        </div>
    );
}
