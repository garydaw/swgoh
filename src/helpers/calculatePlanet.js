import { OPERATION_IDS } from "./rotePlannerDefaults";

export function getAvailableOperations(guildData, planet) {
    if (!guildData || !planet) return [];

    return (guildData?.[planet.alignment]?.[String(planet.level)] ?? [])
        .map(Number)
        .filter((op) => OPERATION_IDS.includes(op));
}

export function calculateOperationPoints(
    selectedOperations,
    operationValues,
    planetLevel
) {
    const operationValue =
        Number(operationValues?.[String(planetLevel)] ?? 0);

    return (selectedOperations ?? []).reduce(
        (total) => total + operationValue,
        0
    );
}

export function calculateStars(totalPoints, stars) {
    let result = 0;

    if (totalPoints >= Number(stars?.[1] ?? Infinity)) result = 1;
    if (totalPoints >= Number(stars?.[2] ?? Infinity)) result = 2;
    if (totalPoints >= Number(stars?.[3] ?? Infinity)) result = 3;

    return result;
}

export function calculatePlanet(
    planet,
    plan = {},
    operationValues = {},
    preloadGP = 0
) {
    const operations = plan.operations ?? [];
    const operationPoints = calculateOperationPoints(
        operations,
        operationValues,
        planet.level
    );
    const missionPoints = Math.max(0, Number(plan.missions ?? 0));
    const deploymentGP = Math.max(0, Number(plan.deployment ?? 0));
    const inheritedPreloadGP = Math.max(0, Number(preloadGP ?? 0));

    const totalPoints =
        operationPoints +
        missionPoints +
        deploymentGP +
        inheritedPreloadGP;

    const stars = calculateStars(totalPoints, planet.stars);

    const nextStarThreshold =
        stars >= 3
            ? null
            : Number(planet.stars?.[stars + 1] ?? 0);

    const pointsToNextStar =
        nextStarThreshold === null
            ? 0
            : Math.max(0, nextStarThreshold - totalPoints);

    return {
        planetId: planet.planetId,
        name: planet.name,
        alignment: planet.alignment,
        level: planet.level,
        operationPoints,
        missionPoints,
        deploymentGP,
        preloadGP: inheritedPreloadGP,
        totalPoints,
        stars,
        nextStarThreshold,
        pointsToNextStar,
        thresholds: planet.stars,
    };
}
