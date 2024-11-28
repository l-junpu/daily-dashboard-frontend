import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Message, TitleInfo } from "../../data/llm-data";
import { ObjectId } from "bson";
import { LLMDashboardContext } from "./context";

export const LLMDashboardContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // View Navigation
  const navigate = useNavigate();

  // Username
  const [username, setUsername] = useState<string | null>(null);

  // Create a New Chat
  const [newTitle, setNewTitle] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [docs, setDocs] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [createChat, setCreateChat] = useState<boolean>(false);

  // Dashboard Display Data
  const [titles, setTitles] = useState<TitleInfo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // Conversation Data
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [awaitingResponse, setAwaitingResponse] = useState(false);
  const [activeTitleId, setActiveTitleId] = useState<ObjectId | null>(null);

  return (
    <LLMDashboardContext.Provider
      value={{
        navigate,
        username,
        setUsername,
        newTitle,
        setNewTitle,
        tags,
        setTags,
        docs,
        setDocs,
        selectedTags,
        setSelectedTags,
        selectedDocs,
        setSelectedDocs,
        createChat,
        setCreateChat,
        titles,
        setTitles,
        messages,
        setMessages,
        activeTitleId,
        setActiveTitleId,
        currentPrompt,
        setCurrentPrompt,
        awaitingResponse,
        setAwaitingResponse,
      }}
    >
      {children}
    </LLMDashboardContext.Provider>
  );
};
