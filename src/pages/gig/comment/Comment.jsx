import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";
import './Comment.css';

const Column = ({ id }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('access');
    const fetchUserData = async () => {
      try {
        const response_user = await axios.get("http://127.0.0.1:8000/api/auth/users/me/", {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setCurrentUser(response_user.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/comments?product_id=${id}`)
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();

    const userId = currentUser ? currentUser.id : null; // Replace `currentUser` with the actual variable holding user data

    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("product", id);       // Assuming 'id' is the product ID
    formData.append("user", userId);   // Attach user ID
    formData.append("text", newComment);  // The comment text

    // Post the comment
    axios
      .post("http://127.0.0.1:8000/api/comments/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        setComments([...comments, response.data]);  // Assuming you're adding the new comment to state
        setNewComment("");
      })
      .catch((error) => {
        console.error("Error posting comment:", error.response ? error.response.data : error.message);
      });
  };



  return (
    <section className="vh-100">
      <MDBContainer className="py-5" style={{ maxWidth: "700px" }}>
        <MDBRow className="justify-content-center">
          <div className="reviews">
            <h2>Reviews</h2>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment p-8 item ">
                  <div className="user">
                    <img
                      className="pp"
                      src={comment.user.profile_picture || "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1600"}
                      alt={comment.user.first_name}
                    />
                    <div className="info">
                      <span>{comment.user.first_name}</span>
                    </div>
                  </div>
                  <p>{comment.text}</p>
                </div>
              ))
            )}

            {/* Add New Comment */}
            {currentUser && (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="input-group">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add your comment..."
                    required
                    className="comment-textarea"
                  />
                </div>
                <div className="submit-btn-container">
                  <button type="submit" className="submit-btn" onClick={handleCommentSubmit}>
                    Post Comment
                  </button>
                </div>
              </form>
            )}
          </div>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};

export default Column;
