import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-container">
      <h1>Bienvenue dans l'univers Marvel !</h1>
      <p>
        Découvrez les héros, vilains et aventures de l’univers Marvel. Explorez
        les personnages et les comics, et ajoutez vos favoris !
      </p>
      <div className="hero-buttons-container">
        <Link to="/characters" className="hero-buttons">
          Ils sont trop forts 💪
        </Link>
        <Link to="/comics" className="hero-buttons">
          La bibliothèque 📚
        </Link>
        <Link to="/favorites" className="hero-buttons">
          Je les adore 🤩
        </Link>
      </div>
    </div>
  );
};

export default Hero;
