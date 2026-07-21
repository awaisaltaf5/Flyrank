import { useState, useEffect, useRef } from "react";
import ThemeSelector from "./ThemeSelector";
import NotificationToggle from "./NotificationToggle";
import SuccessMessage from "./SuccessMessage";
import FormField from "./FormField";
import useLocalStorage from "../hooks/useLocalStorage";
import { validateForm } from "../utils/validators";

function useProfileForm() {
  const [username, setUsername] = useLocalStorage("username", "");
  const [email, setEmail] = useLocalStorage("email", "");
  const [theme, setTheme] = useLocalStorage("theme", "system");
  const [notifications, setNotifications] = useLocalStorage("notifications", false);

  const [errors, setErrors] = useState({ username: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply theme class to body whenever theme changes
  useEffect(() => {
    document.body.classList.toggle("dark-theme", theme === "dark");
    if (theme !== "dark") {
      document.body.classList.remove("dark-theme");
    }
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { isValid, errors: validationErrors } = validateForm({
      username,
      email,
    });

    setErrors({
      username: validationErrors.username,
      email: validationErrors.email,
    });

    if (isValid) {
      // values are already persisted via useLocalStorage
      setSuccessMessage("Settings saved successfully!");
    } else {
      setSuccessMessage("");
    }
    setIsSubmitting(false);
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    theme,
    setTheme,
    notifications,
    setNotifications,
    errors,
    successMessage,
    isSubmitting,
    handleSubmit,
    setSuccessMessage,
  };
}

export default function ProfileForm() {
  const {
    username,
    setUsername,
    email,
    setEmail,
    theme,
    setTheme,
    notifications,
    setNotifications,
    errors,
    successMessage,
    isSubmitting,
    handleSubmit,
    setSuccessMessage,
  } = useProfileForm();

  const firstErrorRef = useRef(null);

  // Focus first invalid field after submit
  useEffect(() => {
    if (errors.username || errors.email) {
      firstErrorRef.current?.focus();
    }
  }, [errors]);

  return (
    <div className="dashboard">
      <h1>Profile Settings</h1>
      <SuccessMessage message={successMessage} />
      <form onSubmit={handleSubmit} className="form" aria-label="Profile settings form">
        <FormField
          label="Username"
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setSuccessMessage("");
          }}
          error={errors.username}
          inputRef={firstErrorRef}
          ariaInvalid={!!errors.username}
          ariaDescribedby={errors.username ? "username-error" : undefined}
        />

        <FormField
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setSuccessMessage("");
          }}
          error={errors.email}
          inputRef={null}
          ariaInvalid={!!errors.email}
          ariaDescribedby={errors.email ? "email-error" : undefined}
        />

        <ThemeSelector theme={theme} onChange={setTheme} />
        <NotificationToggle enabled={notifications} onChange={setNotifications} label="Enable Notifications" />
        <button type="submit" className="save-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}