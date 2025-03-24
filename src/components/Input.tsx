
interface InputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void; 
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  onKeyPress 
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
      onKeyPress={onKeyPress} 
    />
  );
};

export default Input;