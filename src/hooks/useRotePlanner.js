import { useMemo, useState } from "react";
import { buildRoteData } from "../helpers/buildRoteData";
import { calculateStrategy } from "../helpers/calculateStrategy";
import { EMPTY_PLAN, ALIGNMENTS } from "../helpers/rotePlannerDefaults";

function buildInitialPlanner(roteData) {
    const planets = {};

    for (const alignment of ALIGNMENTS) {
        for (const planet of roteData.planets?.[alignment] ?? []) {
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

    // Unlike the old implementation, the current phase is the calculated
    // phase result because its planets depend on progression through earlier
    // phases.
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
