import "./llm-fileupload.css";
import "react-toastify/dist/ReactToastify.css";

import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bounce, ToastContainer, toast } from "react-toastify";

import FetchAPI from "../api/helper";
import IconButton from "../base-component/icon-button/icon-button";

// For Secondary Navbar
interface ButtonProps {
  text: string;
  onClick: () => void;
}

const LLMFileUploadView = () => {
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement | null>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  // Active Buttons
  const secondaryButtonProps: ButtonProps[] = [
    {
      text: "📋 Conversations",
      onClick: () => {
        navigate("/dashboard/llm/conversations", { replace: true });
      },
    },
    { text: "⚙️ Add Embeddings", onClick: () => {} },
  ];
  const [selectedSecondaryButton, setSelectedSecondaryButton] = useState(1); // Just Highlight ⚙️ Add Embeddings

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

  // Scroll to bottom of file list when files are updated
  useEffect(() => {
    if (endRef && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [files]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"], "text/plain": [".txt"] },
    multiple: true,
  });

  const removeFile = useCallback((removeFile: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file !== removeFile));
    toast.info(`Removed ${removeFile.name}`);
  }, []);

  return (
    <div className="dashboard-container">
      <ToastContainer position="bottom-right" />
      {/* Dashboard Header */}
      <header className="dashboard-header">HEADER</header>
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

        {/* Main Task Contents */}
        <main className="file-dashboard-contents">
          <div {...getRootProps({ className: "file-dropzone" })}>
            <p>Drag & drop some files here, or click to select files</p>
            <button>Select Files</button>
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
                  <button className="remove-btn" onClick={() => removeFile(file)}>
                    X
                  </button>
                </li>
              ))}
              <div ref={endRef} />
            </ul>
          </div>
          <div className="footer">
            {/* Rememnber to set uploading here to lock */}
            <button onClick={() => {}}>Upload</button>
            <button
              onClick={() => {
                if (files.length) toast.warn("Removed all files");
                setFiles([]);
              }}
            >
              Clear All
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LLMFileUploadView;
