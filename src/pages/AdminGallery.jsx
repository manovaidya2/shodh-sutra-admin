import React, { useState, useEffect } from "react";
import axios from "../api/axiosInstance";

const AdminGallery = () => {
  const [image, setImage] = useState(null); // for new upload or update
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // which image is being updated

  // Fetch all images
  const fetchImages = async () => {
    try {
      const res = await axios.get("/gallery");
      setImages(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to fetch images" });
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Upload new image
  const uploadHandler = async (e) => {
    e.preventDefault();
    if (!image) {
      setMessage({ type: "error", text: "Please select an image" });
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      if (updatingId) {
        // Update existing image
        await axios.put(`/gallery/${updatingId}`, formData);
        setMessage({ type: "success", text: "Image updated successfully!" });
        setUpdatingId(null);
      } else {
        // Upload new image
        await axios.post("/gallery/upload", formData);
        setMessage({ type: "success", text: "Image uploaded successfully!" });
      }
      setImage(null);
      fetchImages();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: updatingId ? "Image update failed!" : "Image upload failed!" });
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`/gallery/${id}`);
      setMessage({ type: "success", text: "Image deleted successfully!" });
      fetchImages();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to delete image!" });
    }
  };

  // Prepare update
  const prepareUpdate = (img) => {
    setUpdatingId(img._id);
    setImage(null); // require new file to replace
    setMessage({ type: "info", text: "Select a new file to replace the image" });
  };

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>🎨 Admin Gallery</h2>

      {/* Message */}
      {message && (
        <div
          style={{
            marginBottom: 15,
            padding: 10,
            borderRadius: 6,
            color: "#fff",
            backgroundColor:
              message.type === "success"
                ? "#4caf50"
                : message.type === "error"
                ? "#f44336"
                : "#2196f3",
            textAlign: "center",
          }}
        >
          {message.text}
        </div>
      )}

      {/* Upload / Update Form */}
      <form
        onSubmit={uploadHandler}
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 30,
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            padding: "10px 20px",
            border: "2px dashed #ccc",
            borderRadius: 8,
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            transition: "all 0.2s",
          }}
        >
          {image ? image.name : updatingId ? "Select new image to update" : "Select Image"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
            transition: "0.2s",
          }}
          disabled={loading}
        >
          {loading ? "Processing..." : updatingId ? "Update Image" : "Upload Image"}
        </button>
        {updatingId && (
          <button
            type="button"
            onClick={() => {
              setUpdatingId(null);
              setImage(null);
              setMessage(null);
            }}
            style={{
              padding: "10px 20px",
              borderRadius: 8,
              border: "none",
              backgroundColor: "#f44336",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Cancel Update
          </button>
        )}
      </form>

      {/* Gallery Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 15,
        }}
      >
        {images.map((img) => (
          <div
            key={img._id}
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 8,
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              transition: "transform 0.2s",
            }}
          >
            <img
              src={`https://api.shodhsutra.com${img.imageUrl}`}
              alt=""
              style={{
                width: "100%",
                height: 120,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.6)",
                color: "#fff",
                display: "flex",
                justifyContent: "space-around",
                padding: "5px 0",
                fontSize: 12,
              }}
            >
              <button
                onClick={() => prepareUpdate(img)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
              <button
                onClick={() => deleteHandler(img._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGallery;
