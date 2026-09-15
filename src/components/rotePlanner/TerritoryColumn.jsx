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
    nextPlanet,
    onUpdate,
}) {
    const available = result?.availableOperations ?? getAvailableOperations(guildData, planet);
    const selectedOperations = result?.selectedOperations ?? [];

    const update = (changes) => onUpdate(planet.planetId, changes);

    const deploymentGP = Math.max(0, Number(plan.deployment ?? 0));
    const inheritedPreload = Math.max(0, Number(result?.preloadGP ?? 0));

    // Deployment is limited by both the remaining phase budget and the amount
    // actually needed to reach 3 stars. Inherited preload counts towards the
    // planet's points, but does not consume this phase's GP budget.
    const threeStarThreshold = Number(planet.stars?.[3] ?? 0);
    const pointsBeforeDeployment =
        Number(result?.operationPoints ?? 0) +
        Number(result?.missionPoints ?? 0) +
        inheritedPreload;

    const GPToThreeStars = Math.max(
        0,
        threeStarThreshold - pointsBeforeDeployment
    );

    const maxDeployment = Math.min(
        Math.max(0, Number(availableGP ?? 0)),
        GPToThreeStars
    );

    const displayedDeployment = Math.min(deploymentGP, maxDeployment);

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

            <div className="territory-input-row">
                <label htmlFor={`${planet.planetId}-missions`}>
                    Expected mission points
                </label>

                <div className="territory-input-with-unit">
                    <input
                        id={`${planet.planetId}-missions`}
                        className="number-input"
                        type="number"
                        min="0"
                        step="1"
                        value={
                            Math.max(0, Number(plan.missions ?? 0)) / 1_000_000
                        }
                        onChange={(event) =>
                            update({
                                missions: Math.max(
                                    0,
                                    (Number(event.target.value) || 0) * 1_000_000
                                ),
                            })
                        }
                    />
                    <span>M</span>
                </div>
            </div>

            <div className="territory-input-row">
                <label htmlFor={`${planet.planetId}-deployment`}>
                    Deployment GP
                </label>

                <div className="territory-input-with-unit">
                    <input
                        id={`${planet.planetId}-deployment`}
                        className="number-input"
                        type="number"
                        min="0"
                        max={maxDeployment / 1_000_000}
                        step="1"
                        value={displayedDeployment / 1_000_000}
                        onChange={(event) =>
                            update({
                                deployment: Math.min(
                                    maxDeployment,
                                    Math.max(
                                        0,
                                        (Number(event.target.value) || 0) *
                                            1_000_000
                                    )
                                ),
                            })
                        }
                    />
                    <span>M</span>
                </div>
            </div>

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
        </section>
    );
}
