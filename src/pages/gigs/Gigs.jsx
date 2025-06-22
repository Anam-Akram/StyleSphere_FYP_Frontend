import React, { useRef, useState, useEffect } from "react";
import "./Gigs.scss";
import GigCard from "../../components/gigCard/GigCard";
import { useParams } from "react-router-dom";
import axios from "axios";

function Gigs() {
  const [sort, setSort] = useState("sales");
  const [open, setOpen] = useState(false);
  const minRef = useRef();
  const maxRef = useRef();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [istailor, setIstailor] = useState(false);
  const [tailorData, setTailorData] = useState([]);
  const { title } = useParams();

  const reSort = (type) => {
    setSort(type);
    setOpen(false);
  };

  const apply = () => {
    console.log(minRef.current.value);
    console.log(maxRef.current.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (title === "Tailor") {
          setIstailor(true);
          const response = await axios.post(
            "http://127.0.0.1:8000/api/auth/get_tailors_data/"
          );

          const data = response.data?.data;
          if (Array.isArray(data)) {
            setTailorData(data);
          } else {
            setTailorData([]);
            console.error("Tailor data is not an array.");
          }
        } else {
          const formData = new FormData();
          formData.append("cat_name", title);

          const response = await axios.post(
            "http://127.0.0.1:8000/api/categoryProducts/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          setCategories(response.data.data || []);
        }
      } catch (err) {
        setError("No data found for this category.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [title]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!istailor && categories.length === 0) {
    return <p>No products found for this category.</p>;
  }

  if (istailor && tailorData.length === 0) {
    return <p>No tailor data found.</p>;
  }

  return (
    <div className="gigs">
      <div className="container">
        {!istailor && (
          <div className="cards">
            {categories.map((gig) => (
              <GigCard key={gig.id} item={gig} />
            ))}
          </div>
        )}

        {istailor && (
          <div className="cards">
            {tailorData.map((tailor) => (
              <div className="gigCard">
                {/* <div className="gigCardImageContainer"> */}
                  <img
                    className="gigCardImage"
                    src={
                      tailor.image && tailor.image.startsWith("/media")
                        ? `http://127.0.0.1:8000${tailor.image}`
                        : tailor.image || "./img/default-image.png"
                    }
                    alt={`${tailor.first_name} ${tailor.last_name}`}
                  />
                {/* </div> */}

                <hr className="divider" />
                <div className="gigCardInfo">
                  <h3 className="gigCardTitle">
                    {tailor.first_name} {tailor.last_name}
                  </h3>
                  <p className="gigCardDetail">
                    <strong>Phone:</strong> {tailor.phone_number}
                  </p>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gigs;
