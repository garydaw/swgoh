export function MissionInput({ value = 0, onChange }) {
    return (
        <div className="planner-field">
            <label htmlFor="mission-points">
                Expected Mission Points
            </label>

            <input
                id="mission-points"
                type="number"
                min="0"
                step="1000000"
                value={value}
                onChange={event =>
                    onChange(Number(event.target.value) || 0)
                }
            />
        </div>
    );
}
