import { ALIGNMENTS } from "../data/rotePlannerDefaults";
import { calculatePhase } from "./calculatePhase";
import { getPlanetFromPhase } from "./roteData";

/**
 * Walk all phases in order.
 *
 * The manual planner stores deployment against planet IDs. Preload is derived
 * from the phase result when the planet remains below its first unearned star.
 *
 * A production optimiser can later call the same calculation functions while
 * trying different deployment allocations.
 */
export function calculateStrategy({
    roteData,
    planner,
    operationPoints = {},
    guildGP = 0,
}) {
    const phaseResults = [];
    let incomingPreloads = {};
    let totalStars = 0;
    let totalDeployment = 0;

    for (const phase of roteData.phases) {
        const result = calculatePhase({
            phase,
            planner,
            operationPoints,
            incomingPreloads,
        });

        const generatedPreloads = {};

        for (const alignment of ALIGNMENTS) {
            const planet = getPlanetFromPhase(phase, alignment);

            if (!planet) {
                continue;
            }

            const planetId = planet.planetId ?? planet.id;
            const planetResult = result.planets[planetId];

            if (!planetResult) {
                continue;
            }

            // If this planet has not reached 1 star, its deployment is
            // effectively a preload for this planet. It carries forward
            // into the same planet's future availability representation.
            //
            // The UI exposes this as "preload". A later optimiser can
            // redirect the allocation to the next planet once unlocked.
            if (planetResult.stars === 0 && planetResult.deploymentGP > 0) {
                generatedPreloads[planetId] = planetResult.deploymentGP;
            }
        }

        totalStars += result.totalStars;
        totalDeployment += result.totalDeployment;

        phaseResults.push({
            ...result,
            generatedPreloads,
        });

        incomingPreloads = generatedPreloads;
    }

    return {
        phases: phaseResults,
        totalStars,
        totalDeployment,
        remainingGP: Math.max(
            0,
            Number(guildGP) - totalDeployment
        ),
    };
}
