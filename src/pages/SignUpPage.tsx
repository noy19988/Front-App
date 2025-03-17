import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Form from "../components/Form";
import { signUpUser } from "../services/api-client";
import "../styles/auth.css";

function SignUpPage() {
  const navigate = useNavigate();

  const [resetKey, setResetKey] = useState(Date.now());
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({});

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setResetKey(Date.now());
    setValidationErrors({});
  }, []);

  const validateForm = () => {
    const errors: { username?: string; email?: string; password?: string } = {};

    if (username.length < 2) {
      errors.username = "Username must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~\\-]).{6,}$/;
    if (!passwordRegex.test(password)) {
      errors.password = "Password must be at least 6 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      const data = await signUpUser(username, email, password);
      console.log("Sign Up Success:", data);
      navigate("/login");
    } catch (err) {
      const axiosError = err as AxiosError;
      const errorData = axiosError.response?.data as unknown;
      const errorMessage = typeof errorData === "object" && errorData !== null && "message" in errorData
        ? (errorData as { message: string }).message
        : "Sign up failed";
      setError(errorMessage);
    }
  };

  const handleKeyPressUsername = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === ' ') {
      event.preventDefault();
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">Sign Up</h2>
        {error && <p className="error-text">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Input
            key={resetKey + "-username"}
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPressUsername}
          />
          {validationErrors.username && <p className="error-text">{validationErrors.username}</p>}

          <Input
            key={resetKey + "-email"}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {validationErrors.email && <p className="error-text">{validationErrors.email}</p>}

          <Input
            key={resetKey + "-password"}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {validationErrors.password && <p className="error-text">{validationErrors.password}</p>}

          <Button text="Sign Up" onClick={handleSubmit} />
          <div className="text-center mt-3">
            <p>
              Already have an account? <a href="/login">Login</a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default SignUpPage;