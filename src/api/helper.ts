export enum HttpStatusCode {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  INTERNAL_SERVER_ERROR = 500,
}

export const FetchResponse = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
