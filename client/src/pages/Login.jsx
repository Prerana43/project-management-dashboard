import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Login() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const { login } =
    useContext(AuthContext);

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        const res =
          await API.post(
            "/auth/login",
            {
              email,
              password,
            }
          );

        login(res.data.token);

        navigate("/dashboard");

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Login Failed"
        );

      }
    };

  return (

    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h1>Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>
            setEmail(e.target.value)
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
          required
        />

        <button type="submit">
          Login
        </button>

        <p>
          Don't have an account?
          <Link to="/register">
            Register
          </Link>
        </p>

      </form>

    </div>

  );
}

export default Login;