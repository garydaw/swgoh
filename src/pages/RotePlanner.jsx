import { useLoaderData } from "react-router-dom";
import { apiRequest } from "../helpers/ApiRequest";

import { RoteHeader } from "../components/rotePlanner/RoteHeader";
import { PhaseSelector } from "../components/rotePlanner/PhaseSelector";
import { PhaseSummary } from "../components/rotePlanner/PhaseSummary";
import { TerritoryColumn } from "../components/rotePlanner/TerritoryColumn";
import { PreloadPanel } from "../components/rotePlanner/PreloadPanel";
import { useRotePlanner } from "..//hooks/useRotePlanner";
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

    const availableGP =
        Math.max(0, guildGP - strategy.totalAllocatedGP);

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
            <RoteHeader
                guildGP={guildGP}
                projectedStars={strategy.totalStars}
                targetStars={strategy.maxStars}
                remainingGP={strategy.remainingGP}
            />

            <div className="planner-toolbar">
                <div>
                    <strong>{currentPhase.name}</strong>
                    <span className="planner-toolbar__hint">
                        Configure operations, missions, deployment and preload.
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
            />

            <div className="territory-grid">
                {ALIGNMENTS.map((alignment) => {
                    const planet = currentPhase[alignment];

                    if (!planet) return null;

                    const planetId = planet.planetId;
                    const result = currentPhaseResult?.planets?.[planetId];
                    const plan = planner.planets[planetId] ?? {};

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
                            onUpdate={updatePlanet}
                        />
                    );
                })}
            </div>

            <PreloadPanel
                phase={currentPhase}
                result={currentPhaseResult}
            />
        </main>
    );
}
