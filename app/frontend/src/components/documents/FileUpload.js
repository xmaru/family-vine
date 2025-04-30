import React, { useState, useContext } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../../api/documents";
import { createMetadata } from "../../api/metadata";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/components/FileUpload.css";
import { red } from "@mui/material/colors";

const FileUpload = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [where, setWhere] = useState("");
  const [who, setWho] = useState("");
  const [why, setWhy] = useState("");
  //
  // const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const onDrop = (acceptedFiles) => {
    // Take only the first file
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  // TODO: Change the description into the 5Ws (What, When, Where, Who, Why) fields.

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false, // Only allow one file
  });

  /**
   * Handles the document upload and metadata creation process.
   * First uploads the document, then creates metadata with the 5Ws.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!title.trim()) {
      setError("Please enter a title for the file");
      return;
    }

    if (!who.trim()) {
      setError("Please enter the 'Who' field");
      return;
    }

    try {
      setIsUploading(true);
      setError("");

      // Create form data for document upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      // Do not include the 5Ws in the description
      formData.append("description", "");

      // Upload file using the documents API
      // Important: This returns the document object with its ID
      const response = await uploadDocument(formData);
      const document = response.data;
      const documentId = document.id;

      // Handle progress updates if needed (optional)
      const uploadProgressHandler = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      };
      if (response.config && response.config.onUploadProgress) {
        response.config.onUploadProgress = uploadProgressHandler;
      }

      // Prepare metadata payload
      // Use user.full_name if available, otherwise fallback to user.username
      const creatorOfDocument = user?.full_name || user?.username || "";
      // Important: Send the 5Ws and creator_of_document to the metadata API
      const metadataPayload = {
        what,
        when,
        where,
        who,
        why,
        creator_of_document: creatorOfDocument,
      };
      await createMetadata(documentId, metadataPayload);

      // Navigate to documents page after successful upload and metadata creation
      navigate("/documents");
    } catch (err) {
      console.error("Upload or metadata error:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to upload file or save metadata. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Document</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">
            Title <span style={{ color: red }}>*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
            required
          />
        </div>

        <div
          className="form-group"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{
              width: "48%",
              display: "inline-block",
              marginRight: "4%",
            }}
          >
            <label htmlFor="what">What</label>
            <input
              type="text"
              id="what"
              value={what}
              onChange={(e) => setWhat(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div
            style={{
              width: "48%",
              display: "inline-block",
            }}
          >
            <label htmlFor="when">When</label>
            <input
              type="text"
              id="when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              disabled={isUploading}
            />
          </div>
        </div>

        <div
          className="form-group"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{
              width: "48%",
              display: "inline-block",
              marginRight: "4%",
            }}
          >
            <label htmlFor="where">Where</label>
            <input
              type="text"
              id="where"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              disabled={isUploading}
            />
          </div>
          <div
            style={{
              width: "48%",
              display: "inline-block",
            }}
          >
            <label htmlFor="who">Who</label>
            <input
              type="text"
              id="who"
              value={who}
              onChange={(e) => setWho(e.target.value)}
              disabled={isUploading}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="why">Why</label>
          <input
            type="text"
            id="why"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            disabled={isUploading}
          />
        </div>

        {/* <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            rows={4}
          />
        </div> */}

        <div className="form-group">
          <label>File *</label>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""} ${
              file ? "has-file" : ""
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="file-info">
                <p>Selected file: {file.name}</p>
                <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  disabled={isUploading}
                >
                  Remove
                </button>
              </div>
            ) : isDragActive ? (
              <p>Drop the file here...</p>
            ) : (
              <p>Drag & drop a file here, or click to select a file</p>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="progress-container">
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
            <span>{progress}%</span>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/documents")}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading || !file}
          >
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
