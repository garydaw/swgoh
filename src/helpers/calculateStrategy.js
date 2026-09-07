import { ALIGNMENTS } from "./rotePlannerDefaults";
import { calculatePlanet } from "./calculatePlanet";

export function calculateStrategy(roteData, planner, guildGP, operationValues) {
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

    // GP already sitting on the current planet from previous phases.
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

            // Preload is already on this planet before the new phase starts.
            // calculatePlanet includes it in the planet's points, but it is
            // deliberately NOT part of phaseAllocatedGP.
            const result = calculatePlanet(
                planet,
                plan,
                operationValues,
                preload
            );

            planets[planetId] = result;
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
                // No star means we stay on this planet next phase. Everything
                // deployed onto it is now effectively preload, including any
                // preload that was already there. It has already been paid for
                // in earlier phases, so it is not charged again.
                inheritedPreload[alignment] =
                    preload + result.deploymentGP;

                phasePreload += result.deploymentGP;
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
