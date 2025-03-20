import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Card({ item, isFavorite, toggleFavorite }) {
  return (
    <div className="card">
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

      <button className="favorite-btn" onClick={() => toggleFavorite(item)}>
        <FaHeart color={isFavorite ? "red" : "black"} />
      </button>
    </div>
  );
}

export default Card;
