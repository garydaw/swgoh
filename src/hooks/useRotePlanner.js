import { useMemo, useState } from "react";
import { buildRoteData } from "../helpers/buildRoteData";
import { calculateStrategy } from "../helpers/calculateStrategy";
import { EMPTY_PLAN, ALIGNMENTS } from "../helpers/rotePlannerDefaults";

function buildInitialPlanner(roteData) {
    const planets = {};

    for (const phase of roteData.phases) {
        for (const alignment of ALIGNMENTS) {
            const planet = phase[alignment];
            if (!planet) continue;

            planets[planet.planetId] = {
                ...EMPTY_PLAN,
                operations: [],
            };
        }
    }

    return {
        phase: 1,
        planets,
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
                config?.operationValues ?? {}
            ),
        [roteData, planner, guildGP, config]
    );

    const currentPhase =
        roteData.phases.find((phase) => phase.id === planner.phase) ??
        roteData.phases[0];

    const currentPhaseResult =
        strategy.phases.find((phase) => phase.id === planner.phase) ??
        null;

    function setPhase(phase) {
        setPlanner((current) => ({
            ...current,
            phase: Number(phase),
        }));
    }

    function updatePlanet(planetId, changes) {
        setPlanner((current) => ({
            ...current,
            planets: {
                ...current.planets,
                [planetId]: {
                    ...(current.planets[planetId] ?? EMPTY_PLAN),
                    ...changes,
                },
            },
        }));
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
