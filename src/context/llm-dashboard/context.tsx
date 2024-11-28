import { NavigateFunction } from "react-router-dom";
import { Message, TitleInfo } from "../../data/llm-data";
import React from "react";
import { ObjectId } from "bson";

export type LLMDashboardContextType = {
  // View Navigation
  navigate: NavigateFunction;

  // Username Details
  username: string | null;
  setUsername: (username: string | null) => void;

  // Create a New Chat
  newTitle: string;
  setNewTitle: (title: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  docs: string[];
  setDocs: (tags: string[]) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  selectedDocs: string[];
  setSelectedDocs: (tags: string[]) => void;
  createChat: boolean;
  setCreateChat: (status: boolean) => void;

  // Dashboard Display Data
  titles: TitleInfo[];
  setTitles: (titles: TitleInfo[]) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;

  // Conversation Data
  activeTitleId: ObjectId | null;
  setActiveTitleId: (activeTitleId: ObjectId | null) => void;
  currentPrompt: string;
  setCurrentPrompt: (currentPrompt: string) => void;
  awaitingResponse: boolean;
  setAwaitingResponse: (awaitingResponse: boolean) => void;
};

export const LLMDashboardContext = React.createContext<LLMDashboardContextType | null>(null);
