import APP_URL from "@/constants";

export const apiGet = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`GET request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GET Error:", error);
    throw error;
  }
};

export const apiPost = async (url: string, body: object) => {
  try {
    const response = await fetch(APP_URL + url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`POST request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("POST Error:", error);
    throw error;
  }
};

export const apiPut = async (url: string, body: object) => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`PUT request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("PUT Error:", error);
    throw error;
  }
};

export const apiDelete = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error(`DELETE request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("DELETE Error:", error);
    throw error;
  }
};
