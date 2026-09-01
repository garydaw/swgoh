import { ALIGNMENTS } from "./rotePlannerDefaults";

export function buildRoteData(planets, config) {
    if (!planets || !config?.planets) {
        return { phases: [] };
    }

    const phases = Array.from({ length: 6 }, (_, index) => {
        const phase = index + 1;
        const result = {
            id: phase,
            name: `Phase ${phase}`,
        };

        for (const alignment of ALIGNMENTS) {
            const name = planets?.[alignment]?.[index];
            const data = name
                ? config.planets?.[alignment]?.[name]
                : null;

            if (!name || !data) continue;

            result[alignment] = {
                id: `${alignment}-${name}`,
                planetId: name,
                name,
                alignment,
                level: phase,
                stars: {
                    1: Number(data.star_1 ?? 0),
                    2: Number(data.star_2 ?? 0),
                    3: Number(data.star_3 ?? 0),
                },
            };
        }

        return result;
    });

    return { phases };
}
