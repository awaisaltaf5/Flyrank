export default function NotificationToggle({ enabled, onChange, label }) {
  return (
    <div className="form-group toggle-group">
      <label htmlFor="notifications">{label}</label>
      <div className="toggle-switch">
        <input
          id="notifications"
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
          aria-label="Enable notifications"
        />
        <span className="toggle-slider" aria-hidden="true"></span>
      </div>
    </div>
  );
}