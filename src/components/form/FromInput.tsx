// components/form/FormInput.tsx
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  min?:number;
  max?:number;
   step?: number | string;
  value: number | string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  options?: string[]; // optional, if provided render select dropdown
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  placeholder,
  value,
  error,
  onChange,
  touched,
  required,
  options,
  min,
  max,
  step,
  autoComplete,
  inputMode,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        {options && options.length > 0 ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            aria-invalid={Boolean(error && touched)}
            aria-describedby={error && touched ? `${name}-error` : undefined}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="" disabled>
              Select {label}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={isPassword && showPassword ? "text" : type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            min={min}
            max={max}
            step={step}
            autoComplete={autoComplete}
            inputMode={inputMode}
            aria-invalid={Boolean(error && touched)}
            aria-describedby={error && touched ? `${name}-error` : undefined}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}

        {isPassword && (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && touched && (
        <p id={`${name}-error`} role="alert" className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
