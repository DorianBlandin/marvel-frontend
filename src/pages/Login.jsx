import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://site--marvel--pj2lbzfpm8z4.code.run/login",
        { email, password }
      );

      if (response.data.token) {
        setUser(response.data.token);

        localStorage.setItem("userToken", response.data.token);

        navigate("/");
      } else {
        setErrorMessage("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la connexion :", error.response);
      setErrorMessage("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Login;
