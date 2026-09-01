function formatGP(value) {
    return `${(Number(value || 0) / 1_000_000).toFixed(1)}M`;
}

export function PreloadPanel({ phase, result }) {
    if (!phase || !result) return null;

    const preloadPlanets = Object.values(result.planets ?? {})
        .filter((planet) => planet.preloadGP > 0);

    return (
        <section className="preload-panel">
            <div>
                <h2>Preload Summary</h2>
                <p>
                    GP configured on the current phase to be carried into the
                    next planet of the same alignment.
                </p>
            </div>

            {preloadPlanets.length === 0 ? (
                <div className="preload-panel__empty">
                    No preload currently configured.
                </div>
            ) : (
                <div className="preload-panel__items">
                    {preloadPlanets.map((planet) => (
                        <div key={planet.planetId} className="preload-item">
                            <span>{planet.alignment}</span>
                            <strong>{planet.name}</strong>
                            <em>{formatGP(planet.preloadGP)}</em>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
