import "./llm-dashboard.css";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import FetchAPI from "../api/helper";
import IconButton from "../base-component/icon-button/icon-button";
import TextArea from "../base-component/text-area/text-area";
import VirtualizedList from "../base-component/virtualized-list/virtualized-list";

// For Secondary Navbar
interface ButtonProps {
  text: string;
  onClick: () => void;
}

// For Conversation Display
interface Message {
  role: string;
  contents: string;
}
interface Conversation {
  title: string;
  messages: Message[];
}

const LLMDashboardView = () => {
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement | null>(null);

  // Username
  const [username, setUsername] = useState<string | null>(null);

  // Create New Chat
  const [newTitle, setNewTitle] = useState<string>("");
  const [newModel, setNewModel] = useState<string>("");
  const [createChat, setCreateChat] = useState<boolean>(false);

  // Conversation Data
  const [titles, setTitles] = useState<string[]>([
    "this is a conversation lolasdasdasdasd",
    "this is a conversation",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
    "this is a",
  ]);
  const [activeTitle, setActiveTitle] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      contents:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker",
    },
    {
      role: "assistant",
      contents:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
    {
      role: "user",
      contents:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker",
    },
    {
      role: "assistant",
      contents:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
    {
      role: "user",
      contents:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker",
    },
    {
      role: "assistant",
      contents:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
    },
  ]);

  // Active Buttons
  const secondaryButtonProps: ButtonProps[] = [
    { text: "📋 Conversations", onClick: () => {} },
    {
      text: "🔍 View Embeddings",
      onClick: () => {
        navigate("/dashboard/llm/inspect-db", { replace: true });
      },
    },
    {
      text: "⚙️ Add Embeddings",
      onClick: () => {
        navigate("/dashboard/llm/upload-docs", { replace: true });
      },
    },
  ];
  const [selectedSecondaryButton, setSelectedSecondaryButton] = useState(0);
  const [selectedConversationButton, setSelectedConversationButton] = useState(-1);

  // Retrieve necessary information on initial mount
  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    // Scroll to bottom
    if (endRef && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Retrieve Conversations on Username Update
  useEffect(() => {
    const getConversationsFromUser = async () => {};

    getConversationsFromUser();
  }, [username]);

  // Handle Create Chat
  const handleCreateChat = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Access Form Data
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Get Post Data
    const title: string = formData.get("title") as string;
    const model: string = formData.get("model") as string;
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Header */}
      <header className="dashboard-header">HEADER</header>
      <div className="dashboard-body">
        {/* Redirection to the 2 main applications */}
        <nav className="primary-navbar">
          <IconButton primaryText="📋" hoverText="Tasks" cssStyle="button" onClick={() => navigate("/dashboard/tasks", { replace: true })} />
          <IconButton primaryText="💻" hoverText="LLM" cssStyle="button primary-selected" onClick={() => {}} />
        </nav>

        {/* Redirections to the different Task pages */}
        <nav className="secondary-navbar">
          <p className="prefix">DASHBOARD</p>
          <div style={{ marginBottom: "6px" }}>
            {secondaryButtonProps.map((button, index) => (
              <button key={index} className={selectedSecondaryButton === index ? "selected-button" : "button"} onClick={button.onClick}>
                {button.text}
              </button>
            ))}
          </div>
          <p style={{ borderTop: "1px solid rgb(0,0,0,0.2)" }} className="prefix">
            CHAT HISTORY
          </p>
          <button className="selected-button" onClick={() => setCreateChat(true)}>
            ✚ New Chat
          </button>
          
          <div className="chat-history">
            <VirtualizedList 
              rowCount={titles.length}
              rowComponent={(index) => (
                <button
                key={index}
                className={selectedConversationButton === index ? "selected-button" : "button"}
                onClick={() => {
                  setSelectedConversationButton(index);
                  setActiveTitle(titles[index]);
                }}
                >
                  <span className="button-text-wrap">{titles[index]}</span>
                </button>
              )}
            />
          </div>
        </nav>

        {/* Main Task Contents */}
        <main className="llm-dashboard-contents">
          {/* Entire Convo Area - Search Bar */}
          <div className="conversation-container">
            {/* Actual Chat Area - 50% Subset of Entire Convo Area */}
            <div className="chat-zone">
              {messages.map((message, index) => (
                <p key={index} className={message.role == "user" ? "chat" : "chat user"}>
                  {message.contents}
                </p>
              ))}
              <div ref={endRef} />
            </div>
          </div>
          <div className="footer">
            <TextArea placeholder="Ask a question..." cssStyle="prompt-search" onChange={setCurrentPrompt} isLocked={awaitingResponse} />
            <IconButton primaryText="🡩" onClick={() => {}} cssStyle={currentPrompt ? "submit ok" : "submit"} />
          </div>
        </main>
      </div>
      {/* Create New Chat Page */}
      {createChat && (
        <form
          className="create-chat-container"
          onSubmit={(e) => {
            handleCreateChat(e);
          }}
        >
          <div className="new-chat-contents">
            <h2>Create New Chat</h2>
            <input type="text" placeholder="New Chat Name" name="chat-name" className="chat-name" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div className="footer">
              <button type="submit" className={newTitle.length > 0 ? "action-button" : "action-button-inactive"} disabled={newTitle.length > 0 ? false : true}>
                Create Chat
              </button>
              <button onClick={() => setCreateChat(false)} className="action-button">
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default LLMDashboardView;
