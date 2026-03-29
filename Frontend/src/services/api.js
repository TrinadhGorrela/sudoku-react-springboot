const API_BASE_URL = "/api/game";
const USER_API_URL = "/api/user";

export const userAPI = {
  register: async (username, email, password) => {
    const response = await fetch(`${USER_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }
    return await response.json();
  },

  login: async (usernameOrEmail, password) => {
    const response = await fetch(`${USER_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
    return await response.json();
  },

  getUserStats: async (userId) => {
    const response = await fetch(`${USER_API_URL}/${userId}/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },
};

const convertToFrontendFormat = (backendBoard) => {
  if (!backendBoard || !Array.isArray(backendBoard)) {
    console.warn("Invalid board data, returning empty board");
    return Array(9).fill().map(() => Array(9).fill(null));
  }
  return backendBoard.map((row) => {
    if (!Array.isArray(row)) {
      console.warn("Invalid row data, returning empty row");
      return Array(9).fill(null);
    }
    return row.map((cell) => (cell === 0 ? null : cell));
  });
};

export const gameAPI = {
  startGame: async (difficulty) => {
    const difficultyParam = (difficulty || "MEDIUM").toUpperCase();
    const response = await fetch(
      `${API_BASE_URL}/start?difficulty=${difficultyParam}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      ...data,
      puzzle: convertToFrontendFormat(data.puzzle),
      currentBoard: convertToFrontendFormat(data.currentBoard),
      solution: convertToFrontendFormat(data.solution),
    };
  },

  getGame: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/${gameId}`);
    if (!response.ok) {
      if (response.status === 404) throw new Error("Game not found");
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      ...data,
      puzzle: convertToFrontendFormat(data.puzzle),
      currentBoard: convertToFrontendFormat(data.currentBoard),
      solution: convertToFrontendFormat(data.solution),
    };
  },

  makeMove: async (gameId, row, col, value) => {
    const response = await fetch(`${API_BASE_URL}/${gameId}/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ row, col, value: value || 0 }),
    });
    if (!response.ok) {
      if (response.status === 409) throw new Error("Game already completed");
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      ...data,
      puzzle: convertToFrontendFormat(data.puzzle),
      currentBoard: convertToFrontendFormat(data.currentBoard),
      solution: convertToFrontendFormat(data.solution),
    };
  },

  undoMove: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/${gameId}/undo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No moves to undo");
      }
      if (response.status === 409) throw new Error("Cannot undo - game is completed");
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return {
      ...data,
      puzzle: convertToFrontendFormat(data.puzzle),
      currentBoard: convertToFrontendFormat(data.currentBoard),
      solution: convertToFrontendFormat(data.solution),
    };
  },

  getHint: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/${gameId}/hint`);
    if (!response.ok) {
      if (response.status === 404) {
        const errorText = await response.text();
        throw new Error(errorText || "No hint available");
      }
      if (response.status === 409) throw new Error("Game already completed");
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  validateSolution: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/${gameId}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  deleteGame: async (gameId) => {
    const response = await fetch(`${API_BASE_URL}/${gameId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      if (response.status === 404) throw new Error("Game not found");
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  },
};
