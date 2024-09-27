const FetchAPI = async (url: string, options: RequestInit = {}): Promise<any> => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export default FetchAPI;
