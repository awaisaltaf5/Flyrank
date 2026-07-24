export default function ThemeSelector({ theme, onChange }) {
  return (
    <div className="form-group">
      <label htmlFor="theme">Theme</label>
      <select
        id="theme"
        value={theme}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select theme"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}