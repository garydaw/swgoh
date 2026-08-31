import { ALIGNMENTS } from "../data/rotePlannerDefaults";
import { calculatePlanet } from "./calculatePlanet";
import { getPlanetFromPhase } from "./roteData";

export function calculatePhase({
    phase,
    planner,
    operationPoints = {},
    incomingPreloads = {},
}) {
    const planets = {};

    for (const alignment of ALIGNMENTS) {
        const planet = getPlanetFromPhase(phase, alignment);

        if (!planet) {
            continue;
        }

        const planetId = planet.planetId ?? planet.id;
        const plan = planner.planets[planetId] ?? {};

        planets[planetId] = calculatePlanet({
            planet,
            selectedOperations: plan.operations ?? [],
            operationPoints,
            missionPoints: plan.missionPoints ?? 0,
            deploymentGP: plan.deploymentGP ?? 0,
            preloadGP: incomingPreloads[planetId] ?? 0,
        });
    }

    const totalStars = Object.values(planets).reduce(
        (total, result) => total + result.stars,
        0
    );

    const totalDeployment = Object.values(planets).reduce(
        (total, result) => total + result.deploymentGP,
        0
    );

    const totalPreload = Object.values(planets).reduce(
        (total, result) => total + result.preloadGP,
        0
    );

    return {
        phaseId: phase.id,
        planets,
        totalStars,
        totalDeployment,
        totalPreload,
    };
}
