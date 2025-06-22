import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactDOM from "react-dom";
import "./Add.scss";

const Add = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    images: [],
    shortdis: "",
    description: "",
    location: "",
    price: "",
  });

  const [userId, setUserId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/category/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchSubcategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/subcategory/");
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchCategories();
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/auth/users/me/", {
          headers: { Authorization: `JWT ${token}` },
        })
        .then((response) => setUserId(response.data.id))
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleCategoryChange = (e) => {
    setFormData({ ...formData, category: parseInt(e.target.value) });
  };

  const handleSubcategoryChange = (e) => {
    setFormData({ ...formData, Subcategory: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.images.length < 1 || formData.images.length > 5) {
      setError("You must upload between 1 and 5 images.");
      setShowPopup(true);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("Subcategory", formData.Subcategory);
    formData.images.forEach((image) => data.append("images", image));
    data.append("shortdis", formData.shortdis);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("price", formData.price);
    data.append("tailor", userId);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/product/", data, {
        headers: {
          Authorization: `JWT ${localStorage.getItem("access")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
      console.log("Product added successfully:", response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.detail || "Please fill in each field.");
        setShowPopup(true);
      } else {
        setError("Please fill in each field.");
        setShowPopup(true);
      }
    }
  };

  const closePopup = () => setShowPopup(false);

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <h5>{error}</h5>
                <button onClick={closePopup} className="popup-close-btn">Close</button>
              </div>
            </div>
          )}
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product title"
          />

          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label htmlFor="subcategory">Subcategory</label>
          <select
            name="subcategory"
            value={formData.Subcategory}
            onChange={handleSubcategoryChange}
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory.id} value={subcategory.id}>
                {subcategory.name}
              </option>
            ))}
          </select>

          <label htmlFor="images">Product Images</label>
          <input
            type="file"
            name="images"
            onChange={handleFileChange}
            multiple
          />

          <label htmlFor="shortdis">Short Description</label>
          <textarea
            name="shortdis"
            value={formData.shortdis}
            onChange={handleChange}
            placeholder="Short description"
          />

          <label htmlFor="description">Detailed Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description"
          />

          <label htmlFor="location">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Product location"
          />

          <label htmlFor="price">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
          />

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default Add;
