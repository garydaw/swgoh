import { useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import { apiRequest } from '../helpers/ApiRequest';

import { RoteHeader } from "../components/rotePlanner/RoteHeader";
import { PhaseSelector } from "../components/rotePlanner/PhaseSelector";
import { PhaseSummary } from "../components/rotePlanner/PhaseSummary";
import { TerritoryColumn } from "../components/rotePlanner/TerritoryColumn";
import { PreloadPanel } from "../components/rotePlanner/PreloadPanel";
import { useRotePlanner } from "../rote-planner/hooks/useRotePlanner";
import { ALIGNMENTS } from "../rote-planner/data/rotePlannerDefaults";

import "../css/rotePlanner.css";

export async function rotePlannerLoader({ params, request }) {
    const [planets, config, guildData] = await Promise.all([
        apiRequest("rote/planets", true, "GET"),
        apiRequest("rote/config", true, "GET"),
        apiRequest("rote/guildData", true, "GET"),
    ]);

    return {
        planets,
        config,
        guildData: guildData,
    };
}

export default function RotePlanner() {
    const loaderData = useLoaderData();

    const guildGP = Number(
        loaderData?.guildData?.guildGP ??
        0
    );

    const guildData = loaderData?.guildData ?? {};

    const operationValues =
        loaderData?.config?.operationValues ?? {};

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
        roteData: loaderData?.planets,
        config: loaderData?.config,
        guildData,
        guildGP,
        operationValues,
    });

    const currentPlanetPlans = planner.planets;

    const targetStars = useMemo(
        () => roteData.phases.length * 9,
        [roteData.phases.length]
    );

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
                targetStars={targetStars}
                remainingGP={strategy.remainingGP}
            />

            <div className="planner-toolbar">
                <span>
                    {currentPhase.name ?? `Phase ${currentPhase.id}`}
                </span>

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
                {ALIGNMENTS.map(alignment => {
                    const planet = currentPhase[alignment];

                    if (!planet) {
                        return null;
                    }

                    const planetId =
                        planet.planetId ?? planet.id;

                    const result =
                        currentPhaseResult?.planets?.[planetId];

                    const plan =
                        currentPlanetPlans[planetId] ?? {};

                    return (
                        <TerritoryColumn
                            key={alignment}
                            alignment={alignment}
                            planet={planet}
                            result={result}
                            plan={plan}
                            guildData={guildData}
                            operationValues={operationValues}
                            deploymentMax={Math.max(
                                0,
                                guildGP - strategy.totalDeployment
                            )}
                            preload={result?.preloadGP ?? 0}
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
