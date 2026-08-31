/**
 * Operations are deliberately supplied as a map so this utility does not
 * need to know how your API stores operation definitions.
 *
 * Example:
 * operationPoints = {
 *   1: 25000000,
 *   2: 30000000
 * }
 */
export function calculateOperationPoints(
    selectedOperations = [],
    operationPoints = {}
) {
    return selectedOperations.reduce(
        (total, operationId) =>
            total + Number(operationPoints[operationId] ?? 0),
        0
    );
}

export function calculateStars(totalPoints, planet) {
    let stars = 0;

    for (let star = 1; star <= 3; star += 1) {
        const threshold = Number(planet?.stars?.[star] ?? 0);

        if (threshold > 0 && totalPoints >= threshold) {
            stars = star;
        }
    }

    return stars;
}

export function calculatePlanet({
    planet,
    selectedOperations = [],
    operationPoints = {},
    missionPoints = 0,
    deploymentGP = 0,
    preloadGP = 0,
}) {
    const operationsPoints = calculateOperationPoints(
        selectedOperations,
        operationPoints
    );

    const totalPoints =
        operationsPoints +
        Number(missionPoints) +
        Number(deploymentGP) +
        Number(preloadGP);

    const stars = calculateStars(totalPoints, planet);

    const nextStar = stars < 3 ? stars + 1 : null;

    const nextStarThreshold = nextStar
        ? Number(planet?.stars?.[nextStar] ?? 0)
        : null;

    const pointsToNextStar = nextStarThreshold
        ? Math.max(0, nextStarThreshold - totalPoints)
        : 0;

    return {
        planetId: planet?.planetId ?? planet?.id,
        operationsPoints,
        missionPoints: Number(missionPoints),
        deploymentGP: Number(deploymentGP),
        preloadGP: Number(preloadGP),
        totalPoints,
        stars,
        nextStar,
        nextStarThreshold,
        pointsToNextStar,
    };
}

/**
 * Maximum deployment that can be placed on a planet without earning the
 * specified star. We leave one point below the threshold so the deployment
 * cannot accidentally cross it.
 */
export function calculateMaximumPreload({
    planet,
    existingPoints = 0,
    targetStar = 1,
}) {
    const threshold = Number(planet?.stars?.[targetStar] ?? 0);

    if (!threshold) {
        return 0;
    }

    return Math.max(0, threshold - Number(existingPoints) - 1);
}
