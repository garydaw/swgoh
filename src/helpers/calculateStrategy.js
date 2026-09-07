import { ALIGNMENTS } from "./rotePlannerDefaults";
import { calculatePlanet, getAvailableOperations } from "./calculatePlanet";

export function calculateStrategy(
    roteData,
    planner,
    guildGP,
    operationValues,
    guildData
) {
    let totalStars = 0;
    let totalAllocatedGP = 0;
    const phaseResults = [];

    // Guild GP is a fresh budget for every phase.
    const phaseBudget = Math.max(0, Number(guildGP) || 0);

    // Lowest planet on each alignment that has not yet earned a star.
    const activeIndexes = {
        dark: 0,
        neutral: 0,
        light: 0,
    };

    // Operations already completed on a planet in earlier phases.
    // Operations are one-time only, even when the planet carries over.
    const usedOperations = {};

    // GP/mission points already sitting on the current planet from previous phases.
    // This is inherited preload: it contributes points to the planet but
    // does NOT consume the new phase's guild GP budget.
    const inheritedPreload = {
        dark: 0,
        neutral: 0,
        light: 0,
    };

    for (const phase of roteData.phases) {
        const planets = {};
        const activePlanets = {};
        const nextPlanets = {};

        let phaseStars = 0;
        let phaseDeployment = 0;
        let phasePreload = 0;
        let phaseAllocatedGP = 0;

        for (const alignment of ALIGNMENTS) {
            const path = roteData.planets?.[alignment] ?? [];
            const index = activeIndexes[alignment] ?? 0;
            const planet = path[index];

            if (!planet) continue;

            activePlanets[alignment] = planet;
            nextPlanets[alignment] = path[index + 1] ?? null;

            const planetId = planet.planetId;
            const phasePlans = planner.planets?.[phase.id] ?? {};
            const plan = phasePlans[planetId] ?? {};
            const preload = Math.max(
                0,
                Number(inheritedPreload[alignment] ?? 0)
            );

            const availableOperations = getAvailableOperations(
                guildData,
                planet
            );
            const previouslyUsedOperations = new Set(
                usedOperations[planetId] ?? []
            );

            // Operations are one-time only. If this planet carries into a
            // later phase, operations completed in an earlier phase are
            // removed from the current phase's selectable/calculated list.
            const validOperations = (plan.operations ?? [])
                .map(Number)
                .filter(
                    (operation) =>
                        availableOperations.includes(operation) &&
                        !previouslyUsedOperations.has(operation)
                );

            const calculationPlan = {
                ...plan,
                operations: validOperations,
            };

            // Preload is already on this planet before the new phase starts.
            // It includes both deployment GP and mission points carried from
            // previous phases. It contributes to the planet's points but does
            // not consume the new phase's guild GP budget.
            const result = calculatePlanet(
                planet,
                calculationPlan,
                operationValues,
                preload
            );

            result.availableOperations = availableOperations.filter(
                (operation) => !previouslyUsedOperations.has(operation)
            );
            result.selectedOperations = validOperations;

            planets[planetId] = result;

            // Record operations completed on this planet. They remain
            // unavailable if the planet carries into the next phase.
            usedOperations[planetId] = [
                ...new Set([
                    ...(usedOperations[planetId] ?? []),
                    ...validOperations,
                ]),
            ];
            phaseStars += result.stars;
            phaseDeployment += result.deploymentGP;

            // Only new deployment consumes this phase's GP budget.
            phaseAllocatedGP += result.deploymentGP;

            if (result.stars >= 1) {
                // The planet has progressed, so its deployment remains on that
                // planet and does not become preload for the next planet.
                inheritedPreload[alignment] = 0;

                if (index < path.length - 1) {
                    activeIndexes[alignment] = index + 1;
                }
            } else {
                // No star means we stay on this planet next phase. Both
                // deployment GP and mission points become preload. Existing
                // preload has already been paid for in earlier phases, so it
                // is carried forward without consuming the new phase budget.
                const newPreload =
                    result.deploymentGP + result.missionPoints;

                inheritedPreload[alignment] = preload + newPreload;

                phasePreload += newPreload;
            }
        }

        totalStars += phaseStars;
        totalAllocatedGP += phaseAllocatedGP;

        phaseResults.push({
            id: phase.id,
            name: phase.name ?? `Phase ${phase.id}`,
            stars: phaseStars,
            maxStars: 9,
            phaseBudgetGP: phaseBudget,
            totalAllocatedGP: phaseAllocatedGP,
            totalDeploymentGP: phaseDeployment,
            // New preload created by this phase. It is simply deployment on
            // planets that did not earn a star.
            totalPreload: phasePreload,
            remainingGP: Math.max(0, phaseBudget - phaseAllocatedGP),
            overBudgetGP: Math.max(0, phaseAllocatedGP - phaseBudget),
            planets,
            activePlanets,
            nextPlanets,
        });
    }

    return {
        totalStars,
        maxStars: roteData.phases.length * 9,
        totalAllocatedGP,
        // Informational only: each phase receives a fresh guild GP allowance.
        remainingGP: Math.max(
            0,
            phaseResults.at(-1)?.remainingGP ?? phaseBudget
        ),
        phases: phaseResults,
    };
}
