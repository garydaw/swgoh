export function PhaseSelector({
    phases,
    currentPhase,
    results,
    onChange,
}) {
    return (
        <nav className="phase-selector">
            {phases.map(phase => {
                const result = results.find(
                    item => Number(item.phaseId) === Number(phase.id)
                );

                const selected =
                    Number(currentPhase) === Number(phase.id);

                return (
                    <button
                        key={phase.id}
                        type="button"
                        className={selected ? "selected" : ""}
                        onClick={() => onChange(phase.id)}
                    >
                        <span>{phase.name ?? `Phase ${phase.id}`}</span>
                        <strong>
                            ⭐ {result?.totalStars ?? 0}
                        </strong>
                    </button>
                );
            })}
        </nav>
    );
}
