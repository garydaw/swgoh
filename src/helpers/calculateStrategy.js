import { ALIGNMENTS } from "./rotePlannerDefaults";
import { calculatePlanet } from "./calculatePlanet";

export function calculateStrategy(roteData, planner, guildGP, operationValues) {
    let totalStars = 0;
    let totalAllocatedGP = 0;
    const phaseResults = [];

    const preloadForNextPhase = {
        dark: 0,
        neutral: 0,
        light: 0,
    };

    for (const phase of roteData.phases) {
        const planets = {};
        let phaseStars = 0;
        let phaseDeployment = 0;
        let phasePreload = 0;

        for (const alignment of ALIGNMENTS) {
            const planet = phase[alignment];
            if (!planet) continue;

            const planetId = planet.planetId;
            const plan = planner.planets[planetId] ?? {};

            const inheritedPreload = preloadForNextPhase[alignment];

            const result = calculatePlanet(
                planet,
                plan,
                operationValues,
                inheritedPreload
            );

            planets[planetId] = result;
            phaseStars += result.stars;
            phaseDeployment += result.deploymentGP;
            phasePreload += Number(plan.preload ?? 0);

            /*
             * A preload is carried into the next planet in this alignment.
             * It is only valid when this planet has at least one star.
             * The UI/calculation also caps it below the next available
             * star threshold.
             */
            if (result.stars >= 1) {
                preloadForNextPhase[alignment] = Math.max(
                    0,
                    Number(plan.preload ?? 0)
                );
            } else {
                preloadForNextPhase[alignment] = 0;
            }
        }

        totalStars += phaseStars;
        totalAllocatedGP += phaseDeployment;

        phaseResults.push({
            id: phase.id,
            name: phase.name,
            stars: phaseStars,
            maxStars: 9,
            totalAllocatedGP: phaseDeployment,
            totalPreload: phasePreload,
            planets,
        });
    }

    return {
        totalStars,
        maxStars: roteData.phases.length * 9,
        totalAllocatedGP,
        remainingGP: Math.max(0, Number(guildGP) - totalAllocatedGP),
        phases: phaseResults,
    };
}
