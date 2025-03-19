import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenue sur l'Univers Marvel !</h1>
      <p>
        Découvrez les héros, vilains et aventures de l’univers Marvel. Explorez
        les personnages et les comics, et ajoutez vos favoris !
      </p>

      <div className="home-buttons">
        <Link to="/characters" className="home-btn">
          Voir les Personnages
        </Link>
        <Link to="/comics" className="home-btn">
          Explorer les Comics
        </Link>
        <Link to="/favorites" className="home-btn">
          Mes Favoris
        </Link>
      </div>
    </div>
  );
}

export default Home;
