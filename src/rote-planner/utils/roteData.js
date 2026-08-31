import { ALIGNMENTS } from "../data/rotePlannerDefaults";

/**
 * Adapt the API response here if /rote/planets does not already return
 * { phases: [...] }.
 *
 * This keeps the UI/calculation code independent of your API's exact shape.
 */
export function normaliseRoteData(apiData) {
    if (Array.isArray(apiData)) {
        return { phases: apiData };
    }

    if (Array.isArray(apiData?.data)) {
        return { phases: apiData.data };
    }

    if (Array.isArray(apiData?.phases)) {
        return apiData;
    }

    return { phases: [] };
}

export function getPhaseById(roteData, phaseId) {
    return roteData.phases.find(
        phase => Number(phase.id) === Number(phaseId)
    );
}

export function getPlanetFromPhase(phase, alignment) {
    return phase?.[alignment] ?? null;
}

export function getStarThreshold(planet, star) {
    return Number(
        planet?.stars?.[star] ??
        planet?.starThresholds?.[star] ??
        0
    );
}

export function getPhasePlanets(phase) {
    return ALIGNMENTS
        .map(alignment => ({
            alignment,
            planet: getPlanetFromPhase(phase, alignment),
        }))
        .filter(item => item.planet);
}
