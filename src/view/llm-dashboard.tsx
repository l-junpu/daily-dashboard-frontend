import "./llm-dashboard.css";
import "react-toastify/dist/ReactToastify.css";

import { CSSProperties, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ObjectId } from "bson";

import { FetchResponse, HttpStatusCode } from "../api/helper";
import IconButton from "../base-component/icon-button/icon-button";
import TextArea from "../base-component/text-area/text-area";
import VirtualizedList from "../base-component/virtualized-list/virtualized-list";
import { toast, ToastContainer } from "react-toastify";

// For Secondary Navbar
interface ButtonProps {
  text: string;
  onClick: () => void;
}

// For Conversation Display
interface TitleInfo {
  title: string;
  id: ObjectId;
}

interface Message {
  role: string;
  content: string;
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
  const [titles, setTitles] = useState<TitleInfo[]>([]);
  const [activeTitle, setActiveTitle] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

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
  const [selectedTitleIndex, setSelectedTitleIndex] = useState(-1);

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
    const getConversationsFromUser = async () => {
      if (!username) return;

    try {
        const response = await FetchResponse("http://localhost:8080/get_convos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        });

        if (response == null) {
          toast.error("Unable to connect to server");
          return;
        } else {
          switch (response.status) {
            case HttpStatusCode.OK:
              const data = await response.json();
              setTitles(data.convoDetails);
              break;
            default:
              toast.error(`Server side error (Unable to retrieve conversations): ${response.status}`);
              return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

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

    if (!username) return;

    try {
      const response = await FetchResponse("http://localhost:8080/create_new_convo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          title: title,
          tags: [],
          documents: [],
          messages: [],
        }),
      });

      if (response == null) {
        toast.error("Unable to connect to server");
        return;
      } else {
        switch (response.status) {
          case HttpStatusCode.OK:
            const responseJson = await response.json();
            const newTitleInfo: TitleInfo = { title: title, id: responseJson.id };
            setTitles([newTitleInfo, ...titles]);
            toast.success("New chat created");
            break;
          default:
            toast.error(`Server side error: ${response.status}`);
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }

    // Increment selected index by 1 - Because we insert the new chat above
    setSelectedTitleIndex(selectedTitleIndex+1)
    setCreateChat(false);
    setNewTitle("");
  };

  // Handle User Sending a Prompt
  const handleUserPrompt = async (event?: React.FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();

    if (!username) return;

    const userPrompt: Message = {
      role: "user",
      content: currentPrompt
    }

    // Freeze controls
    setCurrentPrompt("");
    setAwaitingResponse(true);
    setMessages([...messages, userPrompt])

    try {
      const response = await FetchResponse("http://localhost:8080/new_user_prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          id: titles[selectedTitleIndex].id,
          message: userPrompt,
        }),
      });

      // Shift Conversation to the front after we send a message
      const idx = titles.findIndex(elem => elem.title == activeTitle);
      if (idx !== -1) {
        const title = titles.splice(idx, 1);
        titles.unshift(title[0]);
        setTitles(titles);
      }

      if (response == null) {
        // Disable Lock
        setAwaitingResponse(false);
        toast.error("Unable to connect to server");
        return;
      } else {
        switch (response.status) {
          case HttpStatusCode.OK:
            // STREAM RESPONSE BACK
            
            // Disable Lock
            setAwaitingResponse(false);
            break;
            default:
              // Disable Lock
              setAwaitingResponse(false);
              toast.error(`Server side error: ${response.status}`);
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle User Retrieving Conversation History
  const handleRetrieveConvoHistory = async (id: ObjectId) => {
    if (!username) return;

    try {
      const response = await FetchResponse("http://localhost:8080/get_convo_history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          id: id,
        }),
      });

      if (response == null) {
        toast.error("Unable to connect to server");
        return;
      } else {
        switch (response.status) {
          case HttpStatusCode.OK:
            const responseMessages = await response.json();
            setMessages(responseMessages.messages);
            break;
            default:
              toast.error(`Server side error: ${response.status}`);
            return;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
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
                className={selectedSecondaryButton === index ? "selected-button" : "button"}
                onClick={() => {
                  setSelectedSecondaryButton(index);
                  setActiveTitle(titles[index].title);
                }}
                >
                  <span className="button-text-wrap">{titles[index].title}</span>
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
              <VirtualizedList 
              rowCount={messages.length}
              rowComponent={(index) => (
                <p key={index} className={messages[index].role == "user" ? "chat" : "chat user"}>
                  {messages[index].content}
                </p>
                )} 
              />
              </div>
            </div>
            <form className="footer" onSubmit={handleUserPrompt}>
              <TextArea placeholder="Ask a question..." cssStyle="prompt-search" text={currentPrompt} onChange={setCurrentPrompt}  onEnterDown={handleUserPrompt} isLocked={awaitingResponse} />
              <button type="submit" id="submit-prompt" disabled={currentPrompt.length > 0 ? false : true} className={currentPrompt ? "submit ok" : "submit"}>🡩</button>
            </form>
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
              <input
                type="text"
                placeholder="New Chat Name"
                name="title"
                className="chat-name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              <div className="footer">
                <button
                  type="submit"
                  className={newTitle.length > 0 ? "action-button" : "action-button-inactive"}
                  disabled={newTitle.length > 0 ? false : true}
                >
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
    </>
  );
};

export default LLMDashboardView;
