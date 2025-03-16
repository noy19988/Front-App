import React, { ChangeEvent, KeyboardEvent } from "react";

interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void; // הוספנו את onKeyPress
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  onKeyPress // הוספנו את onKeyPress
}) => {
  const computedAutoComplete = type === "email" ? "username" : "new-password";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete || computedAutoComplete}
      className="input-field"
      onKeyPress={onKeyPress} // הוספנו את onKeyPress כאן
    />
  );
};

export default Input;