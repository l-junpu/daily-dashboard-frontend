import "./llm-file-upload.css";
import "react-toastify/dist/ReactToastify.css";

import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { connectionStatus, connectSocket, getSocket } from "../api/socket";

import IconButton from "../base-component/icon-button/icon-button";

// For Secondary Navbar
interface ButtonProps {
  text: string;
  onClick: () => void;
}

const LLMFileUploadView = () => {
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement | null>(null);

  // Username
  const [username, setUsername] = useState<string | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const [uploadTag, setUploadTag] = useState("");
  const [confirmTag, setConfirmTag] = useState("");
  const [uploadFiles, setUploadFiles] = useState(false);
  const [canUploadFiles, setCanUploadFiles] = useState(false);

  // Last known status from the ChromaDB Flask Application
  const [lastStatus, setLastStatus] = useState("Retrieving status...");

  // Active Buttons
  const secondaryButtonProps: ButtonProps[] = [
    {
      text: "📋 Conversations",
      onClick: () => {
        navigate("/dashboard/llm/conversations", { replace: true });
      },
    },
    {
      text: "🔍 View Embeddings",
      onClick: () => {
        navigate("/dashboard/llm/inspect-db", { replace: true });
      },
    },
    { text: "⚙️ Add Embeddings", onClick: () => {} },
  ];
  const [selectedSecondaryButton, setSelectedSecondaryButton] = useState(2); // Just Highlight ⚙️ Add Embeddings

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      connectSocket(storedUsername);
    }

    getSocket().on("status_update", (data) => {
      setLastStatus(data.status);
    });
  }, []);

  // Scroll to bottom of file list when files are updated
  useEffect(() => {
    if (endRef && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [files]);

  useEffect(() => {
    if (uploadTag.length === 0 || confirmTag.length === 0 || uploadTag !== confirmTag) setCanUploadFiles(false);
    else setCanUploadFiles(true);
  }, [uploadTag, confirmTag]);

  // When we drop files, this triggers through react-dropzone's onDrop callback
  // Exclude dupe filenames
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((file) => !files.some((existingFile) => existingFile.name === file.name));

      if (newFiles.length > 0) {
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        if (newFiles.length === 1) {
          toast.success(`Added 1 new file`);
        } else {
          toast.success(`Added ${newFiles.length} new files`);
        }
      }
    },
    [files]
  );

  // Dropzone Configurations
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    multiple: true,
  });

  // Handle Remove Files
  const handleRemoveFile = useCallback((removeFile: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== removeFile));
    toast.info(`Removed ${removeFile.name}`);
  }, []);

  // Handle Upload Files
  const handleUploadFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username) return;
    setUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("files[]", file));
    formData.append("username", username);
    formData.append("tag", uploadTag);

    try {
      const response = await fetch("http://localhost:5000/database/api/upload-files/", {
        method: "POST",
        body: formData,
      });

      /*
      Basically here we just sit and wait and receive "Status"
      from the Python Server until it is done with the following:
      1. Downloading Files
      2. Chunking Files
      3. Embedding Files
         - Embedding File X out of Y
      4. Once all 3 tasks are completed, we receive status.ok
      */

      if (response.ok) {
        console.log("Successfully uploaded files to backend for embedding");
      } else {
        console.log("Failed to upload files to backend for embedding");
        console.log(await response.text()); // Log the response text for debugging
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFiles([]);
      setUploading(false);
      handleCancelUpload();
    }
  };

  // Handle Cancel Upload
  const handleCancelUpload = () => {
    setUploadFiles(false);
    setUploadTag("");
    setConfirmTag("");
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="bottom-right" />
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="title">SOBA AI</div>
      </header>
      <div className="dashboard-body">
        {/* Redirection to the 2 main applications */}
        <nav className="primary-navbar">
          <IconButton primaryText="📋" hoverText="Tasks" cssStyle="button" onClick={() => navigate("/dashboard/tasks", { replace: true })} />
          <IconButton primaryText="💻" hoverText="LLM" cssStyle="button primary-selected" onClick={() => {}} />
        </nav>

        {/* Redirections to the different Task pages */}
        <div className="secondary-navbar">
          <p className="prefix">DASHBOARD</p>
          <nav>
            {secondaryButtonProps.map((button, index) => (
              <button key={index} className={selectedSecondaryButton === index ? "selected-button" : "button"} onClick={button.onClick}>
                {button.text}
              </button>
            ))}
          </nav>
        </div>

        {/* Main File Upload Contents */}
        <main className="file-dashboard-contents">
          <h2 style={{ color: "var(--color-font)" }}>{connectionStatus ? "✅ Connected" : "⚠️ Disconnected"}</h2>
          <h4 style={{ color: "var(--color-font)" }}>{lastStatus}</h4>
          <div {...getRootProps({ className: "file-dropzone" })}>
            <p>Drag & drop some files here, or click to select files</p>
            <button className="action-button">Select Files</button>
            <input {...getInputProps()} />
          </div>
          <div className="file-list-wrapper">
            <ul className="file-list">
              {files.map((file, index) => (
                <li key={index} className="file-info">
                  <div className="file-icon">
                    <span>{file.name.split(".").pop()}</span>
                  </div>
                  <div className="file-name">{file.name}</div>
                  <button className="remove-btn" onClick={() => handleRemoveFile(file)}>
                    X
                  </button>
                </li>
              ))}
              <div ref={endRef} />
            </ul>
          </div>
          <div className="footer">
            {/* Rememnber to set uploading here to lock */}
            <button className={files.length > 0 ? "action-button" : "action-button-inactive"} onClick={() => setUploadFiles(true)} disabled={files.length > 0 ? false : true}>
              Upload
            </button>
            <button
              className="action-button-cancel"
              onClick={() => {
                if (files.length) toast.warn("Removed all files");
                setFiles([]);
              }}
            >
              Clear All
            </button>
          </div>
        </main>
        {/* Delete Tag Page */}
        {uploadFiles && (
          <form
            className="upload-files-container"
            onSubmit={(e) => {
              handleUploadFiles(e);
            }}
          >
            <div className="upload-files-contents">
              <h2>Upload Files for RAG</h2>
              <p style={{ marginTop: "8px" }}>Tag your files, and confirm the tag below</p>
              <input type="text" name="tag-name" className="tag-name" placeholder="Tag" value={uploadTag} onChange={(e) => setUploadTag(e.target.value)} />
              <input type="text" name="tag-name" className="tag-name" placeholder="Confirm Tag" value={confirmTag} onChange={(e) => setConfirmTag(e.target.value)} />
              <div className="footer">
                <button type="submit" className={canUploadFiles ? "action-button" : "action-button-inactive"} disabled={!canUploadFiles}>
                  Upload Files
                </button>
                <button onClick={() => handleCancelUpload()} className="action-button-cancel">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LLMFileUploadView;
