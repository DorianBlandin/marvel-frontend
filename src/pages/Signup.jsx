import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup({ setUser }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://site--marvel--pj2lbzfpm8z4.code.run/signup",
        { email, username, password }
      );

      if (response.data.token) {
        if (typeof setUser === "function") {
          setUser(response.data.token);
        } else {
          console.error("⚠️ `setUser` n'est pas une fonction !");
        }

        localStorage.setItem("userToken", response.data.token);

        setErrorMessage("");

        navigate("/");
      }
    } catch (error) {
      console.error("❌ Erreur lors de l'inscription :", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          "Erreur lors de l'inscription. Vérifie tes informations."
        );
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage("");
          }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrorMessage("");
          }}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrorMessage("");
          }}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
}

export default Signup;
