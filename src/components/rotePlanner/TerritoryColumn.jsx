import { getAvailableOperations } from "../../helpers/calculatePlanet";
import { OperationSelector } from "./OperationSelector";

function formatGP(value) {
    const millions = Number(value || 0) / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(2)}M`;
}

function StarProgress({ result, planet }) {
    const maximum = Number(planet.stars[3] || 1);

    return (
        <div className="star-progress">
            <div className="star-progress__track">
                {[1, 2, 3].map((star) => {
                    const threshold = Number(planet.stars[star]);
                    const reached = result.stars >= star;

                    return (
                        <div
                            key={star}
                            className={`star-marker ${
                                reached ? "is-reached" : ""
                            }`}
                            style={{
                                left: `${Math.min(
                                    100,
                                    (threshold / maximum) * 100
                                )}%`,
                            }}
                        >
                            <span>⭐</span>
                            <small>{formatGP(threshold)}</small>
                        </div>
                    );
                })}

                <div
                    className="star-progress__current"
                    style={{
                        left: `${Math.min(
                            100,
                            (result.totalPoints / maximum) * 100
                        )}%`,
                    }}
                />
            </div>
        </div>
    );
}

export function TerritoryColumn({
    alignment,
    planet,
    result,
    plan,
    guildData,
    operationValues,
    availableGP,
    onUpdate,
}) {
    const available = getAvailableOperations(guildData, planet);
    const selectedOperations = plan.operations ?? [];

    const update = (changes) =>
        onUpdate(planet.planetId, changes);

    const maxPreload =
        result?.stars >= 1 && result?.stars < 3
            ? Math.max(
                  0,
                  Number(result.nextStarThreshold ?? 0) -
                      Number(result.totalPoints ?? 0) -
                      1
              )
            : 0;

    const preload = Math.min(
        Math.max(0, Number(plan.preload ?? 0)),
        maxPreload
    );

    return (
        <section className={`territory-column territory-column--${alignment}`}>
            <div className="territory-column__header">
                <div>
                    <span>{alignment}</span>
                    <h2>{planet.name}</h2>
                </div>
                <strong>Level {planet.level}</strong>
            </div>

            <div className="territory-stars">
                <strong>{result?.stars ?? 0} / 3 ⭐</strong>
                {result?.stars < 3 && (
                    <span>
                        {formatGP(result?.pointsToNextStar)} to next star
                    </span>
                )}
            </div>

            <label className="field-label">Operations</label>
            <OperationSelector
                selected={selectedOperations}
                available={available}
                operationValues={operationValues}
                planetLevel={planet.level}
                onChange={(operations) => update({ operations })}
            />

            <label
                className="field-label"
                htmlFor={`${planet.planetId}-missions`}
            >
                Expected mission points
            </label>
            <input
                id={`${planet.planetId}-missions`}
                className="number-input"
                type="number"
                min="0"
                max={availableGP}
                step="1000000"
                value={plan.missions ?? 0}
                onChange={(event) =>
                    update({
                        missions: Math.max(
                            0,
                            Number(event.target.value) || 0
                        ),
                    })
                }
            />

            <label
                className="field-label"
                htmlFor={`${planet.planetId}-deployment`}
            >
                Deployment GP
            </label>
            <input
                id={`${planet.planetId}-deployment`}
                className="number-input"
                type="number"
                min="0"
                step="1000000"
                value={plan.deployment ?? 0}
                onChange={(event) =>
                    update({
                        deployment: Math.max(
                            0,
                            Number(event.target.value) || 0
                        ),
                    })
                }
            />

            <div className="planet-breakdown">
                <div>
                    <span>Operations</span>
                    <strong>{formatGP(result?.operationPoints)}</strong>
                </div>
                <div>
                    <span>Missions</span>
                    <strong>{formatGP(result?.missionPoints)}</strong>
                </div>
                <div>
                    <span>Deployment</span>
                    <strong>{formatGP(result?.deploymentGP)}</strong>
                </div>
                <div>
                    <span>Inherited preload</span>
                    <strong>{formatGP(result?.preloadGP)}</strong>
                </div>
                <div className="planet-breakdown__total">
                    <span>Total</span>
                    <strong>{formatGP(result?.totalPoints)}</strong>
                </div>
            </div>

            <StarProgress result={result} planet={planet} />

            {result?.stars >= 1 && result?.stars < 3 && (
                <div className="preload-box">
                    <div>
                        <strong>Preload next planet</strong>
                        <span>
                            Maximum safe preload: {formatGP(maxPreload)}
                        </span>
                    </div>

                    <input
                        className="number-input"
                        type="number"
                        min="0"
                        max={availableGP}
                        step="1000000"
                        value={preload}
                        onChange={(event) =>
                            update({
                                preload: Math.min(
                                    maxPreload,
                                    availableGP,
                                    Math.max(
                                        0,
                                        Number(event.target.value) || 0
                                    )
                                ),
                            })
                        }
                    />
                </div>
            )}
        </section>
    );
}
