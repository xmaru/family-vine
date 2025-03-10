import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { uploadDocument } from "../../api/documents";
import "../../styles/components/FileUpload.css";
import { red } from "@mui/material/colors";

const FileUpload = () => {
  const navigate = useNavigate();
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

    try {
      setIsUploading(true);
      setError("");

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("what", what);
      formData.append("when", when);
      formData.append("where", where);
      formData.append("who", who);
      formData.append("why", why);

      // if (description.trim()) {
      //   formData.append("description", description);
      // }

      // Upload file using the documents API
      const response = await uploadDocument(formData);

      // Handle progress updates
      const uploadProgressHandler = (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      };

      // Add progress event listener if available
      if (response.config && response.config.onUploadProgress) {
        response.config.onUploadProgress = uploadProgressHandler;
      }

      // Navigate to document detail or list page after successful upload
      navigate("/documents");
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.detail || "Failed to upload file. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='upload-container'>
      <h2>Upload Document</h2>

      {error && <div className='error-message'>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='title'>
            Title <span style={{ color: red }}>*</span>
          </label>
          <input
            type='text'
            id='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
            required
          />
        </div>

        <div
          className='form-group'
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{
              width: "48%",
              display: "inline-block",
              marginRight: "4%",
            }}
          >
            <label htmlFor='what'>What</label>
            <input
              type='text'
              id='what'
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
            <label htmlFor='when'>When</label>
            <input
              type='text'
              id='when'
              value={what}
              onChange={(e) => setWhen(e.target.value)}
              disabled={isUploading}
            />
          </div>
        </div>

        <div
          className='form-group'
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div
            style={{
              width: "48%",
              display: "inline-block",
              marginRight: "4%",
            }}
          >
            <label htmlFor='where'>Where</label>
            <input
              type='text'
              id='where'
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
            <label htmlFor='who'>Who</label>
            <input
              type='text'
              id='who'
              value={who}
              onChange={(e) => setWho(e.target.value)}
              disabled={isUploading}
              required
            />
          </div>
        </div>

        <div className='form-group'>
          <label htmlFor='why'>Why</label>
          <input
            type='text'
            id='why'
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

        <div className='form-group'>
          <label>File *</label>
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""} ${
              file ? "has-file" : ""
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className='file-info'>
                <p>Selected file: {file.name}</p>
                <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                <button
                  type='button'
                  className='btn btn-sm btn-danger'
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
          <div className='progress-container'>
            <div
              className='progress-bar'
              style={{ width: `${progress}%` }}
            ></div>
            <span>{progress}%</span>
          </div>
        )}

        <div className='form-actions'>
          <button
            type='button'
            className='btn btn-secondary'
            onClick={() => navigate("/documents")}
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='btn btn-primary'
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
