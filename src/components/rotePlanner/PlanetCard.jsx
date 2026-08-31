import { OperationSelector } from "./OperationSelector";
import { MissionInput } from "./MissionInput";
import { DeploymentInput } from "./DeploymentInput";
import { PointBreakdown } from "./PointBreakdown";
import { StarProgress } from "./StarProgress";

export function PlanetCard({
    planet,
    result,
    plan = {},
    availableOperations = [],
    operationPoints = {},
    deploymentMax = 0,
    preload = 0,
    onUpdate,
}) {
    const planetId = planet.planetId ?? planet.id;

    return (
        <article className="planet-card">
            <div className="planet-card-header">
                <div>
                    <span className="planet-alignment">
                        {planet.alignment}
                    </span>
                    <h3>{planet.name}</h3>
                </div>

                <div className="planet-stars">
                    {"⭐".repeat(result.stars)}
                    {"☆".repeat(3 - result.stars)}
                </div>
            </div>

            {preload > 0 ? (
                <div className="incoming-preload">
                    🟪 {formatGP(preload)} preloaded
                </div>
            ) : null}

            <OperationSelector
                selected={plan.operations ?? []}
                available={availableOperations}
                operationPoints={operationPoints}
                onChange={operations =>
                    onUpdate(planetId, { operations })
                }
            />

            <MissionInput
                value={plan.missionPoints ?? 0}
                onChange={missionPoints =>
                    onUpdate(planetId, { missionPoints })
                }
            />

            <DeploymentInput
                value={plan.deploymentGP ?? 0}
                max={deploymentMax}
                onChange={deploymentGP =>
                    onUpdate(planetId, { deploymentGP })
                }
            />

            <PointBreakdown result={result} />

            <StarProgress
                planet={planet}
                result={result}
            />
        </article>
    );
}

function formatGP(value) {
    return `${(Number(value) / 1_000_000).toLocaleString(undefined, {
        maximumFractionDigits: 2,
    })}M`;
}
