import { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import API from "../services/api";

function Register() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const navigate =
    useNavigate();

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        await API.post(
          "/auth/register",
          {
            name,
            email,
            password,
          }
        );

        alert(
          "Registration Successful"
        );

        navigate("/");

      } catch (error) {

        alert(
          error.response?.data?.message ||
          "Registration Failed"
        );

      }

    };

  return (

    <div className="auth-container">

      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >

        <h1>Register</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>
            setName(e.target.value)
          }
          required
        />

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
          Register
        </button>

        <p>
          Already have an account?
          <Link to="/">
            Login
          </Link>
        </p>

      </form>

    </div>

  );
}

export default Register;