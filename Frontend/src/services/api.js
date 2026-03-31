const API_BASE_URL = "/api/game";
const USER_API_URL = "/api/user";

async function apiCall(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.clone().json();
      } catch {
        try {
          const text = await response.clone().text();
          if (text) errorData = { message: text };
        } catch {
          void 0;
        }
      }

      const errorMsg = errorData.message || errorData.error;

      if (response.status === 404 && url.includes("/hint")) {
        throw new Error(errorMsg || "No hint available");
      }
      if (response.status === 404) {
        throw new Error(errorMsg || "Game not found");
      }
      if (response.status === 409 && url.includes("/undo")) {
        throw new Error(errorMsg || "Cannot undo - game is completed");
      }
      if (response.status === 409) {
        throw new Error(errorMsg || "Game already completed");
      }
      if (response.status === 400 && url.includes("/undo")) {
        throw new Error(errorMsg || "No moves to undo");
      }

      throw new Error(errorMsg || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204 || options.method === "DELETE") {
      return response;
    }

    return await response.json();
  } catch (error) {
    if (
      error.message.includes("Failed to fetch") ||
      error.message.includes("NetworkError")
    ) {
      throw new Error(
        "Backend server is not running. Please start the backend on port 8080.",
      );
    }
    throw error;
  }
}

export const userAPI = {
  register: async (username, email, password) => {
    return await apiCall(`${USER_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (usernameOrEmail, password) => {
    return await apiCall(`${USER_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
  },

  getUserStats: async (userId) => {
    return await apiCall(`${USER_API_URL}/${userId}/stats`);
  },
};

const convertToFrontendFormat = (backendBoard) => {
  if (!backendBoard || !Array.isArray(backendBoard)) {
    console.warn("Invalid board data, returning empty board");
    return Array(9)
      .fill()
      .map(() => Array(9).fill(null));
  }
  for (let r = 0; r < 9; r++) {
    const row = backendBoard[r];
    if (!Array.isArray(row)) {
      console.warn("Invalid row data, returning empty row");
      backendBoard[r] = Array(9).fill(null);
    } else {
      for (let c = 0; c < 9; c++) {
        if (row[c] === 0) row[c] = null;
      }
    }
  }
  return backendBoard;
};

const formatGameData = (data) => {
  if (!data) return data;
  data.puzzle = convertToFrontendFormat(data.puzzle);
  data.currentBoard = convertToFrontendFormat(data.currentBoard);
  data.solution = convertToFrontendFormat(data.solution);
  return data;
};

export const gameAPI = {
  startGame: async (difficulty) => {
    const difficultyParam = (difficulty || "MEDIUM").toUpperCase();
    const data = await apiCall(
      `${API_BASE_URL}/start?difficulty=${difficultyParam}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    return formatGameData(data);
  },

  getGame: async (gameId) => {
    const data = await apiCall(`${API_BASE_URL}/${gameId}`);
    return formatGameData(data);
  },

  makeMove: async (gameId, row, col, value) => {
    const data = await apiCall(`${API_BASE_URL}/${gameId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row, col, value: value || 0 }),
    });
    return formatGameData(data);
  },

  undoMove: async (gameId) => {
    const data = await apiCall(`${API_BASE_URL}/${gameId}/undo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    return formatGameData(data);
  },

  getHint: async (gameId) => {
    return await apiCall(`${API_BASE_URL}/${gameId}/hint`);
  },

  validateSolution: async (gameId) => {
    return await apiCall(`${API_BASE_URL}/${gameId}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  },

  deleteGame: async (gameId) => {
    return await apiCall(`${API_BASE_URL}/${gameId}`, {
      method: "DELETE",
    });
  },
};
