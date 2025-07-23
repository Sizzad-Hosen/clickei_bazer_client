'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { HTMLInputTypeAttribute } from "react";

interface FormInputProps {
  label: string;
  name: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FormInput = ({
  label,
  name,
  placeholder,
  type = "text",
  value,
  onChange,
  required = false,
  disabled = false,
  className,
}: FormInputProps) => {
  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          "border border-input bg-background text-foreground rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
      />
    </div>
  );
};
