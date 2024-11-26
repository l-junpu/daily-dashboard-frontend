import { FetchResponse, HttpStatusCode } from "./helper";
import { TitleInfo } from "../data/llm-data";
import { ObjectId } from "bson";

/*
    Retrieves all Titles from a User - Called when we initially load into LLM Dashboard
*/
export const getTitlesFromUser = async (username: string | null): Promise<[string, TitleInfo[] | null]> => {
  if (username === null) return ["Username Not Found", null];

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
      return ["Unable to connect to server", null];
    } else {
      switch (response.status) {
        case HttpStatusCode.OK:
          const data = await response.json();
          return ["", data.convoDetails];
          break;
        default:
          return [`Server side error (Unable to retrieve conversations): ${response.status}`, null];
      }
    }
  } catch (error) {
    console.error(error);
  }

  return ["Reached end of control block...", null];
};

/*

*/
// Handle Create Chat
const handleCreateChat = async (
  username: string | null,
  event: React.FormEvent<HTMLFormElement>
): Promise<[string, ObjectId | null]> => {
  event.preventDefault();

  // Access Form Data
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  // Get Post Data
  const title: string = formData.get("title") as string;

  if (!username) return ["Username Not Found", null];

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
      return ["Unable to connect to server", null];
    } else {
      switch (response.status) {
        case HttpStatusCode.OK:
          const responseJson = await response.json();
          return ["New chat created", responseJson.id];
          break;
        default:
          return [`Server side error: ${response.status}`, null];
      }
    }
  } catch (error) {
    console.error(error);
  }

  return ["Reached end of control block...", null];

  //   // Increment selected index by 1 - Because we insert the new chat above
  //   setSelectedTitleIndex(selectedTitleIndex + 1);
  //   setCreateChat(false);
  //   setNewTitle("");
};
