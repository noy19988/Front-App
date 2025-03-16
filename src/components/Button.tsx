import React from "react";

interface ButtonProps {
  text: string;
  onClick: (e?: React.MouseEvent | React.FormEvent) => void; 
}

const Button: React.FC<ButtonProps> = ({ text, onClick }) => {
  return <button className="btn" onClick={(e) => onClick(e)}>{text}</button>;
};

export default Button;
