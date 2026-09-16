import { useLoaderData } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../helpers/apiRequest";

import { RoteHeader } from "../components/rotePlanner/RoteHeader";
import { PhaseSelector } from "../components/rotePlanner/PhaseSelector";
import { PhaseSummary } from "../components/rotePlanner/PhaseSummary";
import { TerritoryColumn } from "../components/rotePlanner/TerritoryColumn";
import { useRotePlanner } from "../hooks/useRotePlanner";
import { ALIGNMENTS } from "../helpers/rotePlannerDefaults";
import { useAuth } from "../store/useAuth";
import { SavedPlans } from "../components/rotePlanner/SavedPlans";

import "../css/rotePlanner.css";

export async function rotePlannerLoader({ params, request }) {
    const [planets, config, guildData, savedPlans] = await Promise.all([
        apiRequest("rote/planets", true, "GET"),
        apiRequest("rote/config", true, "GET"),
        apiRequest("rote/guildData", true, "GET"),
        apiRequest("rote/plans", true, "GET"),
    ]);

    return { planets, config, guildData, savedPlans };
}

export function twcountersLoader({ params, request }) {
    return apiRequest("twcounters/", true, "GET");
}

export default function RotePlanner() {
    const {
        planets,
        config,
        guildData,
        savedPlans: loaderSavedPlans,
    } = useLoaderData();

    const { admin } = useAuth();
    const [savedPlans, setSavedPlans] = useState(
        Array.isArray(loaderSavedPlans) ? loaderSavedPlans : []
    );
    const [currentPlanId, setCurrentPlanId] = useState(null);
    const [planName, setPlanName] = useState("");
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const guildGP = Number(guildData?.guildGP ?? 0);
    const operationValues = config?.operationValues ?? {};

    const {
        planner,
        roteData,
        strategy,
        currentPhase,
        currentPhaseResult,
        setPhase,
        updatePlanet,
        resetPlanner,
        getPlanData,
        loadPlan,
    } = useRotePlanner({
        planets,
        config,
        guildData,
        guildGP,
    });


    async function savePlan() {
        if (admin !== 1 || !planName.trim()) return;

        setSaving(true);

        try {
            const result = await apiRequest("rote/plans", true, "POST", {
                name: planName.trim(),
                plan: getPlanData(),
            });

            const saved = result;

            setSavedPlans((current) => [
                ...current.filter((item) => Number(item.id) !== Number(saved.id)),
                saved,
            ]);
            setCurrentPlanId(saved.id);
            setPlanName(saved.name ?? planName.trim());
        } finally {
            setSaving(false);
        }
    }

    async function updateSavedPlan() {
        if (admin !== 1 || !currentPlanId || !planName.trim()) return;

        setSaving(true);

        try {
            const result = await apiRequest(
                `rote/plans/${currentPlanId}`,
                true,
                "PUT",
                {
                    name: planName.trim(),
                    plan: getPlanData(),
                }
            );

            const saved = result;

            setSavedPlans((current) =>
                current.map((item) =>
                    Number(item.id) === Number(currentPlanId)
                        ? saved
                        : item
                )
            );
            setPlanName(saved.name ?? planName.trim());
        } finally {
            setSaving(false);
        }
    }

    async function saveAsNew() {
        if (admin !== 1 || !planName.trim()) return;
        await savePlan();
    }

    async function deletePlan(plan) {
        if (admin !== 1) return;

        if (!window.confirm(`Delete the saved plan "${plan.name}"?`)) {
            return;
        }

        setDeleting(true);

        try {
            await apiRequest(`rote/plans/${plan.id}`, true, "DELETE");

            setSavedPlans((current) =>
                current.filter((item) => Number(item.id) !== Number(plan.id))
            );

            if (Number(currentPlanId) === Number(plan.id)) {
                setCurrentPlanId(null);
                setPlanName("");
            }
        } finally {
            setDeleting(false);
        }
    }

    function loadSavedPlan(plan) {
        loadPlan(plan);
        setCurrentPlanId(plan.id);
        setPlanName(plan.name ?? "");
    }

    function checkResetPlanner() {
        if (!window.confirm("Reset the planner? All unsaved changes will be lost.")) {
            return;
        }

        resetPlanner();
    }

    function formatMillions(value) {
    const millions = Number(value || 0) / 1_000_000;

    return millions % 1 === 0
        ? `${millions.toFixed(0)}M`
        : `${millions.toFixed(2)}M`;
}

function copyToClipboard(text) {
    if (navigator.clipboard?.writeText) {
        return navigator.clipboard.writeText(text);
    }

    const textArea = document.createElement("textarea");

    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";

    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");

    document.body.removeChild(textArea);

    if (!successful) {
        return Promise.reject(
            new Error("Clipboard copy failed")
        );
    }

    return Promise.resolve();
}

function exportDiscord(detailed) {
    const lines = [];

    lines.push(`⭐ ROTE PLAN — ${strategy.totalStars}⭐`);
    lines.push("");
    let totalStars = 0;
    strategy.phases.forEach((phase) => {
        lines.push(`━━━━━━━━ PHASE ${phase.id} ━━━━━━━━`);

        const planets = Object.values(phase.planets ?? {});

        planets.forEach((planet) => {
            const alignmentIcon = {
                dark: "🌑 Dark",
                neutral: "⚪ Neutral",
                light: "☀️ Light",
            }[planet.alignment] ?? "•";

            const operations = planet.selectedOperations ?? [];

            if (planet.stars >= 1) {
                lines.push(
                    `${alignmentIcon} ${planet.name.toUpperCase()} — ${planet.stars}⭐`
                );
            } else if (phase.id < 6) {
                lines.push(
                    `${alignmentIcon} ${planet.name.toUpperCase()} — PRELOAD → P${phase.id + 1}`
                );
            } else {
                lines.push(
                    `${alignmentIcon} ${planet.name.toUpperCase()} — NO STARS`
                );
            }

            if (operations.length > 0) {
                lines.push(`Ops: ${operations.join(", ")}`);
            }

            if (planet.missionPoints > 0 ) {
                lines.push(
                    `Missions: ${formatMillions(planet.missionPoints)}`
                );
            }

            if (planet.deploymentGP > 0) {
                if( detailed || planet.stars < 1 ) {
                    lines.push(
                        `Deploy: ${formatMillions(planet.deploymentGP)}`
                    );
                }
            }

            lines.push("");
        });

        if( detailed ) {
            lines.push(
                `GP USED: ${formatMillions(phase.totalAllocatedGP)} / ${formatMillions(phase.phaseBudgetGP)}`
            );
        }

        lines.push(`PHASE STARS: ${phase.stars}/9`);
        totalStars += phase.stars;
        lines.push(`RUNNING TOTALSTARS: ${totalStars}/ ${phase.id * 9}`);
        lines.push("");
    });

    const exportText = lines.join("\n");

    copyToClipboard(exportText)
        .then(() => {
            alert("RoTE plan copied to clipboard.");
        })
        .catch(() => {
            console.error("Failed to copy RoTE plan to clipboard.");
        });
}

    if (!currentPhase) {
        return (
            <main className="rote-planner">
                <div className="rote-empty">
                    No RoTE phase data was returned by the API.
                </div>
            </main>
        );
    }

    return (
        <main className="rote-planner">
            <RoteHeader guildGP={guildGP}/>

            <div className="planner-toolbar">
                <div>
                    <strong>{currentPhase.name}</strong>
                    <span className="planner-toolbar__hint">
                        Configure operations, missions and deployment.
                    </span>
                </div>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => exportDiscord(true)}
                >
                    Export Detailed Discord
                </button>
                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => exportDiscord(false)}
                >
                    Export  Discord
                </button>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={checkResetPlanner}
                >
                    Reset Planner
                </button>
            </div>

            <PhaseSelector
                phases={roteData.phases}
                currentPhase={planner.phase}
                results={strategy.phases}
                onChange={setPhase}
            />

            <PhaseSummary
                phase={currentPhase}
                result={currentPhaseResult}
                guildGP={guildGP}
                projectedStars={strategy.totalStars}
                targetStars={strategy.maxStars}
            
            />

            <div className="territory-grid">
                {ALIGNMENTS.map((alignment) => {
                    const planet = currentPhase?.activePlanets?.[alignment];

                    if (!planet) return null;

                    const planetId = planet.planetId;
                    const result = currentPhaseResult?.planets?.[planetId];
                    const plan = planner.planets?.[planner.phase]?.[planetId] ?? {};

                    // GP is a fresh budget for the current phase. Exclude this
                    // planet's existing deployment so its input can be edited
                    // without reducing the amount available to itself.
                    const phaseAllocatedGP = Number(
                        currentPhaseResult?.totalAllocatedGP ?? 0
                    );
                    const ownAllocatedGP = Math.max(
                        0,
                        Number(plan.deployment ?? 0)
                    );
                    const availableGP = Math.max(
                        0,
                        guildGP - (phaseAllocatedGP - ownAllocatedGP)
                    );

                    return (
                        <TerritoryColumn
                            key={alignment}
                            alignment={alignment}
                            planet={planet}
                            result={result}
                            plan={plan}
                            guildData={guildData}
                            operationValues={operationValues}
                            availableGP={availableGP}
                            nextPlanet={currentPhaseResult?.nextPlanets?.[alignment] ?? null}
                            onUpdate={updatePlanet}
                        />
                    );
                })}
            </div>


            <SavedPlans
                plans={savedPlans}
                currentPlanId={currentPlanId}
                isAdmin={admin === 1}
                planName={planName}
                onPlanNameChange={setPlanName}
                onSave={savePlan}
                onSaveAsNew={saveAsNew}
                onLoad={loadSavedPlan}
                onUpdate={updateSavedPlan}
                onDelete={deletePlan}
                saving={saving}
                deleting={deleting}
            />
        </main>
    );
}
