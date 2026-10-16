const STAT_NAMES = {
    1: "Health",
    5: "Speed",
    16: "Critical Damage",
    17: "Potency",
    18: "Tenacity",
    28: "Protection",

    41: "Offense",
    42: "Defense",

    48: "Offense",
    49: "Defense",

    52: "Accuracy",
    53: "Critical Chance",
    54: "Critical Avoidance",
    55: "Health",
    56: "Protection"
};

const PERCENTAGE_STATS = new Set([
    16, // Critical Damage
    17, // Potency
    18, // Tenacity
    48, // Offense %
    49, // Defense %
    52, // Accuracy
    53, // Critical Chance
    54, // Critical Avoidance
    55, // Health
    56  // Protection
]);

function normaliseComlinkMod(base_id, mod) {

    const definition = getDefinitionParts(mod.definitionId);

    const primary = getComlinkPrimary(mod);

    const secondaries = getComlinkSecondaries(mod);

    return {

        id: mod.id,

        character: base_id,

        level: Number(mod.level),

        tier: Number(mod.tier),

        rarity: definition.rarity,

        slot: definition.slot,

        set: definition.set,

        reroll_count: Number(mod.rerolledCount ?? 0),

        primary_stat: primary,

        secondary_stats: secondaries
    };
}

function getDefinitionParts(definitionId) {
    const value = String(definitionId);

    if (!/^\d{3}$/.test(value)) {
        return {
            set: null,
            rarity: null,
            slot: null
        };
    }

    const digits = value
        .split("")
        .map(Number);

    return {
        set: digits[0],
        rarity: digits[1],
        slot: digits[2] + 1
    };
}

function getComlinkPrimary(mod) {
    return getComlinkStat(mod.primaryStat);
}

function getComlinkStat(stat) {

    if (!stat) {
        return null;
    }
    
    const statId = Number(stat.stat.unitStatId);
    const value = Number(stat.stat.unscaledDecimalValue ?? 0);

    const displayValue = PERCENTAGE_STATS.has(statId)
        ? `${(value / 1000000).toFixed(2).replace(/\.?0+$/, '')}%`
        : String(value / 100000000);

    return {
        stat_id: statId,
        name: getStatName(statId),
        display_value: displayValue,

        statValueDecimal: value,
        unscaledDecimalValue: Number(
            stat.stat.unscaledDecimalValue ?? 0
        ),

        roll: Array.isArray(stat.roll)
            ? stat.roll
            : [],

        unscaledRollValue: Array.isArray(stat.unscaledRollValue)
            ? stat.unscaledRollValue
            : [],

        statRolls: Array.isArray(stat.statRolls)
            ? stat.statRolls
            : []
    };
}

function getComlinkSecondaries(mod) {

    return (mod.secondaryStat || []).map(getComlinkStat);
}

function getStatName(statId) {
    return STAT_NAMES[Number(statId)]
        ?? `Unknown (${statId})`;
}

export default normaliseComlinkMod;