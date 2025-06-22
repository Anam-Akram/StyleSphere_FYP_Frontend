import React from "react";
import "./GigCard.scss";
import { Link } from "react-router-dom";

const GigCard = ({ item }) => {
  console.log("item",item)
  return (
    <Link to={`/gig/${item.id}`} className="link">
      <div className="gigCard">
      <img
  src={item.images[0].image.startsWith('/media') ? `http://127.0.0.1:8000${item.images[0].image}` : item.images[0].image}
  alt=""
/>        <div className="info">
          <div className="user" style={{display:'flex',justifyContent:'space-between'}}>
            <span>{item.title}</span>
            <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{item.rating}1</span>
          </div>
          </div>
          <p>{item.shortdis}</p>

        </div>
        <hr />
        <div className="detail">
          <img src="./img/heart.png" alt="" />
          <div className="price">
            <span>STARTING AT</span>
            <h2>
              RS {item.price}
              <sup>99</sup>
            </h2>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;
