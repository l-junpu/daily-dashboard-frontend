import { FetchResponse, HttpStatusCode } from "./helper";
import { Message, TitleInfo } from "../data/llm-data";
import { ObjectId } from "bson";
import { LLMDashboardContextType } from "../context/llm-dashboard/context";

/*
    Retrieves all Titles from a User - Called when we initially load into LLM Dashboard
*/
export const handleGetTitlesFromUserApi = async (
  toast: any,
  username: string | null,
  setTitles: (value: TitleInfo[]) => void
) => {
  if (username === null) return;

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

    if (response === null) {
      toast.error("Unable to connect to server");
    } else {
      switch (response.status) {
        case HttpStatusCode.OK:
          const data = await response.json();
          setTitles(data.convoDetails);
          break;
        default:
          toast.error(`Server side error (Unable to retrieve conversations): ${response.status}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

/*

*/
// Handle Create Chat
export const handleCreateChatApi = async (
  event: React.FormEvent<HTMLFormElement>,
  toast: any,
  context: LLMDashboardContextType
) => {
  event.preventDefault();

  // Retrieve values from llm-dashboard/context
  const { username, setNewTitle, selectedTags, selectedDocs, setCreateChat, titles, setTitles } = context;
  if (username === null) return;

  // Access Form Data
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const title: string = formData.get("title") as string;

  try {
    const response = await FetchResponse("http://localhost:8080/create_new_convo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        title: title,
        tags: selectedTags,
        documents: selectedDocs,
        messages: [],
      }),
    });

    if (response == null) {
      toast.error("Unable to connect to server");
    } else {
      switch (response.status) {
        case HttpStatusCode.OK:
          toast.success("New chat created");

          // Add our new title to the front
          const responseJson = await response.json();
          const newTitleInfo: TitleInfo = { title: title, id: responseJson.id };
          setTitles([newTitleInfo, ...titles]);

          break;
        default:
          toast.error(`Server side error: ${response.status}`);
      }
    }

    // Close the Create New Chat Menu
    setCreateChat(false);
    setNewTitle("");
  } catch (error) {
    console.error(error);
  }
};

// Helper Function to stream response back
async function* decodeStreamToJson(data: ReadableStream<Uint8Array> | null): AsyncIterableIterator<string> {
  if (!data) return;

  const reader = data.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("Completed response");
      break;
    }

    if (value) {
      try {
        yield decoder.decode(value);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Handle User Sending a Prompt
export const handleUserPrompt = async (
  toast: any,
  context: LLMDashboardContextType,
  event?: React.FormEvent<HTMLFormElement>
) => {
  if (event) event.preventDefault();

  const {
    username,
    currentPrompt,
    setCurrentPrompt,
    setAwaitingResponse,
    messages,
    setMessages,
    activeTitleId,
    titles,
    setTitles,
  } = context;

  if (!username) return;

  const userPrompt: Message = {
    role: "user",
    content: currentPrompt,
  };

  const assistantResponse: Message = {
    role: "asisstant",
    content: "",
  };

  // Freeze controls
  setCurrentPrompt("");
  setAwaitingResponse(true);
  messages.push(userPrompt);
  messages.push(assistantResponse);

  try {
    const response = await fetch("http://localhost:8080/new_user_prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        id: activeTitleId,
        message: userPrompt,
      }),
    });

    // Shift Conversation to the front after we send a message
    const idx = titles.findIndex((elem) => elem.id == activeTitleId);
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
      if (response.ok) {
        let assistantResponse: string = "";
        for await (const chunk of decodeStreamToJson(response.body)) {
          assistantResponse += chunk;
          setMessages([...messages.slice(0, messages.length - 1), { role: "assistant", content: assistantResponse }]);
        }
        setAwaitingResponse(false);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

// Handle User Retrieving Conversation History
export const handleRetrieveConvoHistory = async (toast: any, context: LLMDashboardContextType, id: ObjectId) => {
  const { username, activeTitleId, setMessages } = context;

  if (!username) return;

  try {
    // To allow for handling of unloading of Conversations from
    // Redis in the backend
    const body: string =
      activeTitleId === null
        ? JSON.stringify({
            username: username,
            id: id,
          })
        : JSON.stringify({
            username: username,
            prevId: activeTitleId,
            id: id,
          });

    const response = await FetchResponse("http://localhost:8080/get_convo_history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
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

// Handle User Retrieving Conversation History
export const handleGetTagsAndDocumentsFromChroma = async (toast: any, context: LLMDashboardContextType) => {
  return;
  const { username } = context;
  if (!username) return;

  try {
    const response = await FetchResponse("http://localhost:8080/get_tags_and_documents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response == null) {
      toast.error("Unable to connect to server");
      return;
    } else {
      switch (response.status) {
        case HttpStatusCode.OK:
          const responseMessages = await response.json();
          // Save tags and documents
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
