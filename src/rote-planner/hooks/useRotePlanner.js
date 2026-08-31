import { useMemo, useState } from "react";
import { createInitialPlanner, EMPTY_PLAN } from "../data/rotePlannerDefaults";
import { calculateStrategy } from "../utils/calculateStrategy";
import { normaliseRoteData } from "../utils/roteData";

export function useRotePlanner({
    roteData: rawRoteData,
    guildGP = 0,
    operationPoints = {},
}) {
    const roteData = useMemo(
        () => normaliseRoteData(rawRoteData),
        [rawRoteData]
    );

    const [planner, setPlanner] = useState(createInitialPlanner);

    function setPhase(phase) {
        setPlanner(current => ({
            ...current,
            phase: Number(phase),
        }));
    }

    function updatePlanet(planetId, changes) {
        setPlanner(current => ({
            ...current,
            planets: {
                ...current.planets,
                [planetId]: {
                    ...EMPTY_PLAN,
                    ...(current.planets[planetId] ?? {}),
                    ...changes,
                },
            },
        }));
    }

    function resetPlanner() {
        setPlanner(createInitialPlanner());
    }

    const strategy = useMemo(
        () =>
            calculateStrategy({
                roteData,
                planner,
                operationPoints,
                guildGP,
            }),
        [roteData, planner, operationPoints, guildGP]
    );

    const currentPhase = roteData.phases.find(
        phase => Number(phase.id) === Number(planner.phase)
    );

    const currentPhaseResult = strategy.phases.find(
        result => Number(result.phaseId) === Number(planner.phase)
    );

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
