import React, { ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
}

const Form: React.FC<FormProps> = ({ children, onSubmit }) => {
  return <form className="auth-form" onSubmit={onSubmit}>{children}</form>;
};

export default Form;
