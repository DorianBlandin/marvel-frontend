import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="hero-container">
      <h1>Bienvenue sur l'Univers Marvel !</h1>
      <p>
        Découvrez les héros, vilains et aventures de l’univers Marvel. Explorez
        les personnages et les comics, et ajoutez vos favoris !
      </p>
      <div className="hero-buttons-container">
        <Link to="/characters" className="hero-buttons">
          Voir les Personnages
        </Link>
        <Link to="/comics" className="hero-buttons">
          Explorer les Comics
        </Link>
        <Link to="/favorites" className="hero-buttons">
          Mes Favoris
        </Link>
      </div>
    </div>
  );
};

export default Hero;
