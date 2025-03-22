import { Link } from "react-router-dom";
import { useState } from "react";
import { FaHeart } from "react-icons/fa";

function Card({ item, isFavorite, toggleFavorite }) {
  const [imageUrl, setImageUrl] = useState(
    `${item.thumbnail.path}/portrait_xlarge.${item.thumbnail.extension}`
  );

  const handleImageError = () => {
    const fallbackFormats = [
      "portrait_uncanny",
      "portrait_fantastic",
      "portrait_medium",
      "standard_fantastic",
      "standard_large",
      "standard_medium",
    ];

    for (const format of fallbackFormats) {
      const fallbackUrl = `${item.thumbnail.path}/${format}.${item.thumbnail.extension}`;
      if (!imageUrl.includes(format)) {
        setImageUrl(fallbackUrl);
        break;
      }
    }
  };

  const content = (
    <>
      <img
        src={imageUrl}
        alt={item.name || item.title}
        onError={handleImageError}
        className="card-image"
      />
      <p>{item.name || item.title}</p>
    </>
  );

  return (
    <div className="card">
      {item.name ? (
        <Link to={`/character/${item._id}`}>{content}</Link>
      ) : (
        content
      )}

      <button className="favorite-btn" onClick={() => toggleFavorite(item)}>
        <FaHeart color={isFavorite ? "red" : "black"} />
      </button>
    </div>
  );
}

export default Card;
