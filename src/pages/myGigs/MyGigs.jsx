import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./MyGigs.scss";

function MyGigs() {
  const [currentUser, setCurrentUser] = useState(null); // User state
  const [products, setProducts] = useState([]); // Product state

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem('access'); // Get JWT token
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/users/me/", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setCurrentUser(response.data); // Set user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch all products data
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/product/");
        setProducts(response.data); // Set products data
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>; // Show loading if user data is not yet loaded
  }

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>{currentUser.isSeller ? "My Designs" : "My Designs"}</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button className="add-button">Add New Design</button>
            </Link>
          )}
        </div>
        <div className="product-cards">
          {products
            .filter((product) => product.tailor === currentUser.id) // Filter by user ID
            .map((product) => (
              <div className="product-card" key={product.id}>
                <img
                  className="product-image"
                  src={product.images[0].image || "../../../public/img/default_image.png"}
                  alt={product.title}
                />
                <div className="product-info">
                  <h3>{product.title}</h3>

                  <div className="actions">
                  <p className="product-price">
                    { product.price}
                  </p>
                    <button className="delete-btn">
                      <img className="delete" src="./img/delete.png" alt="Delete" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default MyGigs;
