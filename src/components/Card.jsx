import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Card({ item, isFavorite, toggleFavorite }) {
  return (
    <div className="card">
      {/* Si c'est un personnage, on met un Link, sinon juste une image */}
      {item.name ? (
        <Link to={`/character/${item._id}`}>
          <img
            src={`${item.thumbnail.path}/portrait_xlarge.${item.thumbnail.extension}`}
            alt={item.name || item.title}
          />
          <p>{item.name}</p>
        </Link>
      ) : (
        <>
          <img
            src={`${item.thumbnail.path}/portrait_xlarge.${item.thumbnail.extension}`}
            alt={item.name || item.title}
          />
          <p>{item.title}</p>
        </>
      )}

      {/* Bouton favoris */}
      <button className="favorite-btn" onClick={() => toggleFavorite(item)}>
        <FaHeart color={isFavorite ? "red" : "black"} />
      </button>
    </div>
  );
}

export default Card;
