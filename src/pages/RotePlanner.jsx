import { useLoaderData } from "react-router-dom";
import { apiRequest } from "../helpers/apiRequest";

import { RoteHeader } from "../components/rotePlanner/RoteHeader";
import { PhaseSelector } from "../components/rotePlanner/PhaseSelector";
import { PhaseSummary } from "../components/rotePlanner/PhaseSummary";
import { TerritoryColumn } from "../components/rotePlanner/TerritoryColumn";
import { useRotePlanner } from "../hooks/useRotePlanner";
import { ALIGNMENTS } from "../helpers/rotePlannerDefaults";

import "../css/rotePlanner.css";

export async function rotePlannerLoader({ params, request }) {
    const [planets, config, guildData] = await Promise.all([
        apiRequest("rote/planets", true, "GET"),
        apiRequest("rote/config", true, "GET"),
        apiRequest("rote/guildData", true, "GET"),
    ]);

    return { planets, config, guildData };
}

export function twcountersLoader({ params, request }) {
    return apiRequest("twcounters/", true, "GET");
}

export default function RotePlanner() {
    const { planets, config, guildData } = useLoaderData();

    const guildGP = Number(guildData?.guildGP ?? 0);
    const operationValues = config?.operationValues ?? {};

    const {
        planner,
        roteData,
        strategy,
        currentPhase,
        currentPhaseResult,
        setPhase,
        updatePlanet,
        resetPlanner,
    } = useRotePlanner({
        planets,
        config,
        guildData,
        guildGP,
    });


    if (!currentPhase) {
        return (
            <main className="rote-planner">
                <div className="rote-empty">
                    No RoTE phase data was returned by the API.
                </div>
            </main>
        );
    }

    return (
        <main className="rote-planner">
            <RoteHeader guildGP={guildGP}/>

            <div className="planner-toolbar">
                <div>
                    <strong>{currentPhase.name}</strong>
                    <span className="planner-toolbar__hint">
                        Configure operations, missions and deployment.
                    </span>
                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={resetPlanner}
                >
                    Reset Planner
                </button>
            </div>

            <PhaseSelector
                phases={roteData.phases}
                currentPhase={planner.phase}
                results={strategy.phases}
                onChange={setPhase}
            />

            <PhaseSummary
                phase={currentPhase}
                result={currentPhaseResult}
                guildGP={guildGP}
                projectedStars={strategy.totalStars}
                targetStars={strategy.maxStars}
            
            />

            <div className="territory-grid">
                {ALIGNMENTS.map((alignment) => {
                    const planet = currentPhase?.activePlanets?.[alignment];

                    if (!planet) return null;

                    const planetId = planet.planetId;
                    const result = currentPhaseResult?.planets?.[planetId];
                    const plan = planner.planets?.[planner.phase]?.[planetId] ?? {};

                    // GP is a fresh budget for the current phase. Exclude this
                    // planet's existing deployment so its input can be edited
                    // without reducing the amount available to itself.
                    const phaseAllocatedGP = Number(
                        currentPhaseResult?.totalAllocatedGP ?? 0
                    );
                    const ownAllocatedGP = Math.max(
                        0,
                        Number(plan.deployment ?? 0)
                    );
                    const availableGP = Math.max(
                        0,
                        guildGP - (phaseAllocatedGP - ownAllocatedGP)
                    );

                    return (
                        <TerritoryColumn
                            key={alignment}
                            alignment={alignment}
                            planet={planet}
                            result={result}
                            plan={plan}
                            guildData={guildData}
                            operationValues={operationValues}
                            availableGP={availableGP}
                            nextPlanet={currentPhaseResult?.nextPlanets?.[alignment] ?? null}
                            onUpdate={updatePlanet}
                        />
                    );
                })}
            </div>

        </main>
    );
}
