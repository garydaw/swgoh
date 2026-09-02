import { ALIGNMENTS } from "./rotePlannerDefaults";

function normalisePlanetName(name) {
    return String(name)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

export function buildRoteData(planets, config) {
    const result = {
        planets: {
            dark: [],
            neutral: [],
            light: [],
        },
        phases: Array.from({ length: 6 }, (_, index) => ({
            id: index + 1,
            name: `Phase ${index + 1}`,
        })),
    };

    for (const alignment of ALIGNMENTS) {
        const names = planets?.[alignment] ?? [];
        const configPath = config?.planets?.[alignment] ?? {};

        result.planets[alignment] = names.map((name, index) => {
            const level = index + 1;
            const planetConfig = configPath[name] ?? {};

            return {
                planetId: normalisePlanetName(`${alignment}-${name}`),
                name,
                alignment,
                level,
                stars: {
                    1: Number(planetConfig.star_1 ?? 0),
                    2: Number(planetConfig.star_2 ?? 0),
                    3: Number(planetConfig.star_3 ?? 0),
                },
            };
        });
    }

    return result;
}
