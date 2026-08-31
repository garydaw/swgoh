import { ALIGNMENTS } from "../../rote-planner/data/rotePlannerDefaults";

export function PhaseSummary({ phase, result }) {
    return (
        <section className="phase-summary">
            <div>
                <span className="rote-eyebrow">
                    {phase?.name ?? `Phase ${phase?.id}`}
                </span>
                <h2>Projected result</h2>
            </div>

            <div className="phase-stars">
                {ALIGNMENTS.map(alignment => {
                    const planet = phase?.[alignment];

                    if (!planet) {
                        return null;
                    }

                    const id = planet.planetId ?? planet.id;
                    const stars = result?.planets?.[id]?.stars ?? 0;

                    return (
                        <div key={alignment}>
                            <span>{alignment}</span>
                            <strong>
                                {"⭐".repeat(stars)}
                                {"☆".repeat(3 - stars)}
                            </strong>
                        </div>
                    );
                })}

                <div className="phase-total">
                    <span>Total</span>
                    <strong>⭐ {result?.totalStars ?? 0}</strong>
                </div>
            </div>
        </section>
    );
}
