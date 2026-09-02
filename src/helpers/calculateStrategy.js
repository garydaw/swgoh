import { ALIGNMENTS } from "./rotePlannerDefaults";
import { calculatePlanet } from "./calculatePlanet";

export function calculateStrategy(roteData, planner, guildGP, operationValues) {
    let totalStars = 0;
    let totalAllocatedGP = 0;
    const phaseResults = [];

    // Guild GP is a fresh budget for every phase.
    const phaseBudget = Math.max(0, Number(guildGP) || 0);

    // Index of the lowest planet on each path that has not yet earned a star.
    const activeIndexes = {
        dark: 0,
        neutral: 0,
        light: 0,
    };

    // Preload entered in the previous phase, carried onto the next planet.
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

            // Store the planet actually being worked on this phase BEFORE
            // progression is applied for the following phase.
            activePlanets[alignment] = planet;
            nextPlanets[alignment] = path[index + 1] ?? null;

            const planetId = planet.planetId;
            const plan = planner.planets[planetId] ?? {};
            const preload = inheritedPreload[alignment] ?? 0;

            const result = calculatePlanet(
                planet,
                plan,
                operationValues,
                preload
            );

            planets[planetId] = result;
            phaseStars += result.stars;
            phaseDeployment += result.deploymentGP;

            const enteredPreload = Math.max(0, Number(plan.preload ?? 0));
            phasePreload += enteredPreload;
            phaseAllocatedGP += result.deploymentGP + enteredPreload;

            // Once a planet earns at least one star, the next phase can move
            // to the next planet on that alignment. The preload is carried
            // onto that next planet. If no star is earned, stay on this planet
            // and discard the attempted preload because it cannot progress.
            if (result.stars >= 1) {
                inheritedPreload[alignment] = enteredPreload;
                if (index < path.length - 1) {
                    activeIndexes[alignment] = index + 1;
                }
            } else {
                // Any preload already sitting on this planet remains there
                // for the next phase. It has already been spent from the
                // previous phase's GP budget.
                inheritedPreload[alignment] = preload;
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
        // This is informational only. It is not a TB-wide budget because
        // every phase receives a fresh guild GP allowance.
        remainingGP: Math.max(
            0,
            phaseResults.at(-1)?.remainingGP ?? phaseBudget
        ),
        phases: phaseResults,
    };
}
