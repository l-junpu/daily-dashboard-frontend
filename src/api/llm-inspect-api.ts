import { HttpStatusCode } from "axios";
import { DatabaseValues } from "../data/llm-data";

export const FetchTagsAndDocs = async (toast: any, setTags: (tags: string[]) => void, setUsers: (users: string[]) => void) => {
  try {
    const response = await fetch("http://localhost:5000/database/api/retrieve-tags-and-docs/", {
      method: "GET",
    });
    if (!response.ok) {
      toast.error("Unable to retrieve Tags and Docs from Chroma DB");
      return;
    }

    const responseData = await response.json();
    if (response.status == HttpStatusCode.Ok) {
      setTags(["", ...responseData.tags]);
      setUsers(["", ...responseData.users]);
      console.log("Received tags: ", responseData.tags);
    }
  } catch (error) {
    console.log(error);
  }
};

export const FetchRelevantDocuments = async (
  setDatabase: (db: DatabaseValues[] | null) => void,
  setMaxPageNumber: (max: number) => void,
  tags: string[],
  users: string[],
  page: number,
  rows: number
) => {
  try {
    const response = await fetch("http://localhost:5000/database/api/retrieve-relevant-docs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags: tags,
        users: users,
        page: page,
        rows: rows,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      setDatabase(data.sources);
      setMaxPageNumber(data.maxPages);
    } else {
      setDatabase([]);
    }
  } catch (error) {
    console.log(error);
  }
};
