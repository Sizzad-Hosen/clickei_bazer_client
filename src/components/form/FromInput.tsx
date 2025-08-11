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
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
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
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && touched && (
        <p className="text-red-600 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
