import { useMemo, useState } from "react";
import { buildRoteData } from "../helpers/buildRoteData";
import { calculateStrategy } from "../helpers/calculateStrategy";
import { EMPTY_PLAN, ALIGNMENTS } from "../helpers/rotePlannerDefaults";

function buildInitialPlanner(roteData) {
    const phases = {};

    for (const phase of roteData.phases ?? []) {
        const planets = {};

        for (const alignment of ALIGNMENTS) {
            for (const planet of roteData.planets?.[alignment] ?? []) {
                planets[planet.planetId] = {
                    ...EMPTY_PLAN,
                    operations: [],
                };
            }
        }

        phases[phase.id] = planets;
    }

    return {
        phase: 1,
        // Inputs are stored per phase. This is important because deployment,
        // missions and operations entered in Phase 1 must not become the
        // fresh deployment/missions/operations for Phase 2.
        planets: phases,
    };
}

export function useRotePlanner({
    planets,
    config,
    guildData,
    guildGP,
}) {
    const roteData = useMemo(
        () => buildRoteData(planets, config),
        [planets, config]
    );

    const [planner, setPlanner] = useState(() =>
        buildInitialPlanner(roteData)
    );

    const strategy = useMemo(
        () =>
            calculateStrategy(
                roteData,
                planner,
                guildGP,
                config?.operationValues ?? {},
                guildData
            ),
        [roteData, planner, guildGP, config]
    );

    const currentPhaseResult =
        strategy.phases.find((phase) => phase.id === planner.phase) ??
        strategy.phases[0] ??
        null;

    const currentPhase = currentPhaseResult;

    function setPhase(phase) {
        setPlanner((current) => ({
            ...current,
            phase: Number(phase),
        }));
    }

    function updatePlanet(planetId, changes) {
        setPlanner((current) => {
            const phaseId = Number(current.phase);
            const phasePlans = current.planets?.[phaseId] ?? {};

            return {
                ...current,
                planets: {
                    ...current.planets,
                    [phaseId]: {
                        ...phasePlans,
                        [planetId]: {
                            ...(phasePlans[planetId] ?? EMPTY_PLAN),
                            ...changes,
                        },
                    },
                },
            };
        });
    }

    function resetPlanner() {
        setPlanner(buildInitialPlanner(roteData));
    }

    return {
        planner,
        roteData,
        strategy,
        currentPhase,
        currentPhaseResult,
        setPhase,
        updatePlanet,
        resetPlanner,
    };
}
