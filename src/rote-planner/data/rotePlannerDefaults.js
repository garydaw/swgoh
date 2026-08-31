export const ALIGNMENTS = ["dark", "neutral", "light"];

export const EMPTY_PLAN = {
    operations: [],
    missionPoints: 0,
    deploymentGP: 0,
};

export function createInitialPlanner() {
    return {
        phase: 1,
        planets: {},
    };
}
