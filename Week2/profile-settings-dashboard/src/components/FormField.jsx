import { forwardRef } from "react";

export default forwardRef(function FormField(
  { label, id, type, value, onChange, error, inputRef, ariaInvalid, ariaDescribedby },
  ref
) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef || ref}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
      />
      {error && (
        <span id={ariaDescribedby} className="error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
});