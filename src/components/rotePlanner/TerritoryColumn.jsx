import { PlanetCard } from "./PlanetCard";

export function TerritoryColumn({
    alignment,
    planet,
    result,
    plan,
    availableOperations,
    operationValues,
    deploymentMax,
    preload,
    onUpdate,
}) {
    return (
        <section className={`territory-column ${alignment}`}>
            <header>
                <span>{alignment}</span>
                <strong>
                    {"⭐".repeat(result?.stars ?? 0)}
                </strong>
            </header>

            <PlanetCard
                planet={{
                    ...planet,
                    alignment,
                }}
                result={result}
                plan={plan}
                availableOperations={availableOperations}
                operationPoints={operationValues}
                deploymentMax={deploymentMax}
                preload={preload}
                onUpdate={onUpdate}
            />
        </section>
    );
}
