import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AxiosError } from "axios";
import Input from "../components/Input";
import Button from "../components/Button";
import Form from "../components/Form";
import { loginUser } from "../services/api-client";
import "../styles/auth.css";
import { CredentialResponse } from "@react-oauth/google"; 


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      if (!data || !data.token || !data.userId) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError;
      setError(
        axiosError.response?.data && typeof axiosError.response?.data === "object"
          ? (axiosError.response.data as { message?: string }).message || "Login failed"
          : "Login failed"
      );
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("Google credential is missing");
      }
  
      const res = await fetch("https://node115.cs.colman.ac.il/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
  
      const data: { message?: string; token?: string; refreshToken?: string; userId?: string } = await res.json();
  
      if (!res.ok || !data.token || !data.userId) {
        throw new Error(data.message ?? "Google login failed");
      }
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken ?? "");
      localStorage.setItem("userId", data.userId);
      navigate("/");
    } catch (error) {
      console.error("Google Login Error:", error);
      setError(error instanceof Error ? error.message : "Failed to login with Google");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="text-center">Login</h2>
        {error && <p className="error-text">{error}</p>}
        <Form onSubmit={handleSubmit}>
          <Input autoComplete="off" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input autoComplete="off" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button text="Login" onClick={handleSubmit} />

          {}
          <div className="google-btn-container">
            <GoogleLogin onSuccess={handleGoogleLogin} onError={() => setError("Google Login Failed")} />
          </div>

          <div className="text-center mt-3">
            <p>Don't have an account? <a href="/signup">Sign up</a></p>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
