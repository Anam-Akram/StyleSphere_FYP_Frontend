import "./Gig.scss";
import { Slider } from "infinite-react-carousel/lib";
import Column from "./comment/Comment";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Model from "./model/model";
function Gig() {
  const navigate = useNavigate();
  const { id  } = useParams();
  const [tailorData, setTailorData] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [errorTailor, setErrorTailor] = useState(null);
  const [tailorID, setTailorID] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [roomID, setRoomId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [humanImage, setHumanImage] = useState(null);
  const [garmImage, setGarmImage] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);


  const apiEndpoint = "https://api.segmind.com/v1/idm-vton";
  const apiKey = "SG_93397c85b76a8f2e";
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    console.log('token data', token)
    if (!token) {
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/users/me/",
          {
            headers: {
              Authorization: `JWT ${token}`,
            },
          }
        );
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/product/${id}/`);
        setProduct(response.data);
        setTailorID(response.data.tailor)
        const fetchTailorData = async (tailorID) => {
          setLoadingTailor(true);
          setErrorTailor(null);

          try {
            const response = await fetch("http://127.0.0.1:8000/api/auth/tailor_data/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ id: tailorID }),
            });

            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setTailorData(data);
            console.log("--------------------", data);
          } catch (err) {
            setErrorTailor(err.message);
          } finally {
            setLoadingTailor(false);
          }
        };
        if (response.data?.tailor) {
          await fetchTailorData(response.data?.tailor);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const createChatRoom = async () => {
      if (!currentUser?.id || !tailorID) {
        alert("Missing user or tailor data. Please try again.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.post("http://127.0.0.1:8000/api/chat/chats/", {
          user: currentUser.id,
          members: [currentUser.id, tailorID],
        });

        console.log("Chat room created successfully:", res.data);

        const roomId = res.data?.data?.roomId;
        if (roomId) {
          setRoomId(roomId);
          console.log("Room ID updated:", roomId);
        } else {
          console.error("No room ID returned from the API.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while creating the chat room.");
        console.error("Error creating chat room:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id && tailorID) {
      console.log('working........')
      createChatRoom();
    }
  }, [currentUser, tailorID]);

  const handleClick = () => {
    if (currentUser?.id && roomID) {
      navigate("/message", { state: { roomID } });
    } else {
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);

  };
  // const handleImageProcessingAndApiRequest = async (event) => {
  //   if (!currentUser?.id) {
  //     setShowPopupformodel(true); // Prompt login if user is not logged in
  //     return;
  //   }

  //   try {
  //     const file = event.target.files[0];
  //     if (!file) {
  //       console.error("No file selected.");
  //       return;
  //     }

  //     if (!product?.images?.length) {
  //       console.error("No garment image available.");
  //       return;
  //     }

  //     const garmentImageUrl = product.images[0].image;
  //     const formData = new FormData();
  //     formData.append("user_id", currentUser.id);
  //     formData.append("product_id", product.id);
  //     formData.append("human_image", file);
  //     formData.append("garment_image", garmentImageUrl);

  //     const apiEndpoint = "http://127.0.0.1:8000/api/process_images_and_make_api_call/";

  //     setLoading(true); // Start loading indicator
  //     setApiResponse(null); // Clear any previous response

  //     try {
  //       const response = await axios.post(apiEndpoint, formData, {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });

  //       setApiResponse({ img: response.data.img_url }); // Assuming API returns `img_url`
  //     } catch (apiError) {
  //       console.error("API request failed:", apiError);
  //     } finally {
  //       setLoading(false); // Stop loading indicator
  //     }
  //   } catch (error) {
  //     console.error("Error processing images:", error);
  //   }
  // };


  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  const mapCode = product.location.split("maps.app.goo.gl/")[1];

  const embedUrl = `https://www.google.com/maps/embed?pb=g4vjQ8GKbccb27Y9A`;

  return (
    <div className="gig">

      {isLoading ? (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'Arial, sans-serif' }}>
        <div>
          <h2
            style={{
              backgroundColor: '#932dbb',
              color: '#ffffff',
              padding: '20px',
              borderRadius: '10px',
              display: 'inline-block',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            Loading...
          </h2>
        </div>
        </div>

      ) :(
      <div className="container">
        <div className="left">
          <h1>{product.title}</h1>
          <div className="user">
            <img
              className="pp"
              src={`http://127.0.0.1:8000${tailorData.data.image}`}
              alt=""
            />
            <span>{tailorData.data.first_name}</span>
            <div className="stars">
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <img src="/img/star.png" alt="" />
              <span>5</span>
            </div>
          </div>
          <Slider slidesToShow={1} arrowsScroll={1} className="slider">
            <img src={product.images[0].image} alt="" />

          </Slider>
          <p>{product.description}</p>
          <div className="seller">
            <h2>About The Tailor</h2>
            <div className="user">
              <img
                src={`http://127.0.0.1:8000${tailorData.data.image}`}
                alt=""
              />
              <div className="info">
                <span>{tailorData.data.first_name}</span>
                <div className="stars">
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <img src="/img/star.png" alt="" />
                  <span>5</span>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-6 pt-0">
            <Column key={id} id={id} />
          </div>
          <div style={{ width: "100%", height: "500px" }}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: "0" }}
        allowFullScreen=""
        loading="lazy"
        title="Map"
      ></iframe>
    </div>
        </div>
        <div className="right">
          <div className="price">
            <h3>{product.title}</h3>
            <h2>{product.price}</h2>
          </div>
          <p>{product.shortdis}</p>
          <button className="phone">{tailorData.data.phone_number}</button>

          <button onClick={handleClick}>Chat</button>


          {/* Render the popup using React Portal */}


            {showPopup &&
            ReactDOM.createPortal(
              <div className="popup">
                <div className="popup-content">
                  <h3>Please Login</h3>
                  <p>You need to be logged in to start a chat.</p>
                  <button
                    onClick={closePopup}
                    style={{
                      backgroundColor: '#932dbb',
                      marginTop: '10px',
                      padding: '10px',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '20px',
                      cursor: 'pointer',
                      justifyContent: 'center',
                      borderRadius: '8px'
                    }}
                  >
                    Close
                  </button>


                </div>
              </div>,
              document.body
            )}

          <style>
            {`
              .popup {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999; /* Ensure it's above all other elements */
              }
              .popup-content {
                background: white;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
                z-index: 10000;
              }
            `}
          </style>
          <div style={{height:"900px",width:'400px',backgroundColor:"white"}}>

          <Model currentUser={currentUser} product={product} />
</div>
        </div>


      </div>)}
    </div>
  );
};
export default Gig;


