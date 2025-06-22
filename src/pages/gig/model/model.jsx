import React, { useState } from "react";
import axios from "axios";
import ReactDOM from 'react-dom';
const Model = ({ currentUser, product }) => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopupformodel, setShowPopupformodel] = useState(false);

  const handleImageProcessingAndApiRequest = async (event) => {
    if (!currentUser?.id) {
        setShowPopupformodel(true);
              return;
    }

    try {
      const file = event.target.files[0];
      if (!file || !product?.images?.length) {
        alert("File or garment image is missing.");
        return;
      }

      const garmentImageUrl = product.images[0].image;
      const formData = new FormData();
      formData.append("user_id", currentUser.id);
      formData.append("product_id", product.id);
      formData.append("human_image", file);
      formData.append("garment_image", garmentImageUrl);

      const apiEndpoint = "http://127.0.0.1:8000/api/process_images_and_make_api_call/";

      setLoading(true);
      setApiResponse(null);

      try {
        const response = await axios.post(apiEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        });

        const imageUrl = URL.createObjectURL(response.data);
        setApiResponse({ img: imageUrl });
      } catch (apiError) {
        console.error("API request failed:", apiError);
        alert("Failed to process images.");
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      alert("An error occurred.");
    }
  };
  const closePopup = () => {
    setShowPopupformodel(false)

  };

  return (
    <div>
        {showPopupformodel &&
            ReactDOM.createPortal(
              <div className="popup">
                <div className="popup-content">
                  <h3>Please Login</h3>
                  <p>You need to be logged in to use AI model.</p>
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
        <div style={{ position: "relative", display: "inline-block" }}>
  <button
    onClick={() => document.getElementById("fileInput").click()}
    style={{
      width:'262%',
      height: "75px",
      borderRadius: "10px",
      padding: "10px 20px",
      fontSize: "16px",
      cursor: "pointer",
    }}
  >
    Upload Picture
  </button>
  <input
    type="file"
    id="fileInput"
    onChange={handleImageProcessingAndApiRequest}
        disabled={loading}
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      opacity: 0,
      width: "100%",
      height: "100%",
      cursor: "pointer",
    }}
  />
</div>


      {loading && <p style={{justifyContent:'center',paddingTop:"150px"}}>Processing, please wait...</p>}
      <div style={{ height: "800px", width: "400px", backgroundColor: "white" }}>
        {apiResponse?.img && (
          <img
            src={apiResponse.img}
            alt="Processed Result"
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
    </div>

  );
};

export default Model;
