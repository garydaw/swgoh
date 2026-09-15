export function PhaseSelector({
    phases,
    currentPhase,
    results,
    onChange,
}) {
    return (
        <div className="phase-selector">
            {phases.map((phase) => {
                const result = results?.find(
                    (item) => item.id === phase.id
                );

                return (
                    <button
                        key={phase.id}
                        type="button"
                        className={`phase-selector__button ${
                            Number(currentPhase) === Number(phase.id)
                                ? "is-active"
                                : ""
                        }`}
                        onClick={() => onChange(phase.id)}
                    >
                        <span>Phase {phase.id}</span>
                        <strong>{result?.stars ?? 0} / 9 ⭐</strong>
                    </button>
                );
            })}
        </div>
    );
}
