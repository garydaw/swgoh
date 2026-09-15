export function SavedPlans({
    plans = [],
    currentPlanId,
    isAdmin,
    planName,
    onPlanNameChange,
    onSave,
    onSaveAsNew,
    onLoad,
    onUpdate,
    onDelete,
    saving,
    deleting,
}) {
    return (
        <section className="saved-plans">
            <div className="saved-plans__header">
                <div>
                    <h2>Saved Plans</h2>
                    <span>Load a saved strategy or manage your own plans.</span>
                </div>
            </div>

            {isAdmin && (
                <div className="saved-plans__editor">
                    <input
                        type="text"
                        className="saved-plans__name-input"
                        value={planName}
                        onChange={(event) => onPlanNameChange(event.target.value)}
                        placeholder="Plan name"
                        maxLength={100}
                    />

                    {!currentPlanId && (
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onSave}
                            disabled={saving || !planName.trim()}
                        >
                            {saving ? "Saving..." : "Save New"}
                        </button>)
                    }

                    {currentPlanId && (
                        <>
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={onUpdate}
                                disabled={saving || !planName.trim()}
                            >
                                Update
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={onSaveAsNew}
                                disabled={saving || !planName.trim()}
                            >
                                Save As New
                            </button>
                        </>
                    )}
                </div>
            )}

            {plans.length === 0 ? (
                <div className="saved-plans__empty">No saved plans.</div>
            ) : (
                <div className="saved-plans__list">
                    {plans.map((plan) => (
                        <div
                            className={`saved-plan ${
                                Number(plan.id) === Number(currentPlanId)
                                    ? "is-current"
                                    : ""
                            }`}
                            key={plan.id}
                        >
                            <div className="saved-plan__details">
                                <strong>{plan.name}</strong>
                                {plan.updatedAt && (
                                    <span>
                                        Updated {new Date(plan.updatedAt).toLocaleString("en-GB")}
                                    </span>
                                )}
                            </div>

                            <div className="saved-plan__actions">
                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => onLoad(plan)}
                                >
                                    Load
                                </button>

                                {isAdmin && Number(plan.id) === Number(currentPlanId) && (
                                    <button
                                        type="button"
                                        className="secondary-button saved-plan__delete"
                                        onClick={() => onDelete(plan)}
                                        disabled={deleting}
                                    >
                                        {deleting ? "Deleting..." : "Delete"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
