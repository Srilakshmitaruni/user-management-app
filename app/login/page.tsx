"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Simple admin credentials
    if (email === "admin@gmail.com" && password === "123456") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        background: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Login
      </h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "15px" }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "10px",
          background: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Login
      </button>
    </div>
  );
}
