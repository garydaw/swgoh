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
    const available = getAvailableOperations(guildData, planet);
    const selectedOperations = plan.operations ?? [];

    const update = (changes) =>
        onUpdate(planet.planetId, changes);

    const deploymentGP = Math.max(0, Number(plan.deployment ?? 0));
    const enteredPreload = Math.max(0, Number(plan.preload ?? 0));

    // Preload is placed on the next planet, not on the planet currently
    // earning the stars. It is therefore safe only while the current planet
    // has earned at least one star, and it must stay below the next planet's
    // first-star threshold.
    const maxPreload =
        result?.stars >= 1 && nextPlanet
            ? Math.max(0, Number(nextPlanet.stars?.[1] ?? 0) - 1)
            : 0;

    const threeStarThreshold = Number(planet.stars?.[3] ?? 0);

    const pointsBeforeDeployment =
        Number(result?.operationPoints ?? 0) +
        Number(result?.missionPoints ?? 0) +
        Number(result?.preloadGP ?? 0) +
        enteredPreload;

    const GPToThreeStars = Math.max(
        0,
        threeStarThreshold - pointsBeforeDeployment
    );

    const maxDeployment = Math.min(
        availableGP + deploymentGP,
        GPToThreeStars
    );

    const preload = Math.min(
        enteredPreload,
        maxPreload,
        Math.max(0, availableGP - deploymentGP)
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
                        value={deploymentGP / 1_000_000}
                        onChange={(event) =>
                            update({
                                deployment: Math.min(
                                    maxDeployment,
                                    Math.max(
                                        0,
                                        (Number(event.target.value) || 0) * 1_000_000
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

            {result?.stars >= 1 && nextPlanet && (
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
                        max={Math.max(
                            0,
                            Math.min(
                                maxPreload,
                                availableGP - deploymentGP
                            )
                        )}
                        step="1000000"
                        value={preload}
                        onChange={(event) =>
                            update({
                                preload: Math.min(
                                    maxPreload,
                                    Math.max(
                                        0,
                                        availableGP - deploymentGP
                                    ),
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
