const API_BASE_URL = "/api/game";
const USER_API_URL = "/api/user";

const ANONYMOUS_TOKEN_KEY = "sudoku_anonymous_token";

// Generate a UUID for anonymous users
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Get anonymous token from localStorage (persistent across refreshes)
const getAnonymousToken = () => {
  let token = localStorage.getItem(ANONYMOUS_TOKEN_KEY);

  if (!token) {
    // Generate a new token on first visit
    token = generateUUID();
    localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
    console.log("🆕 New anonymous user created:", token);
  } else {
    console.log("🔄 Returning anonymous user:", token);
  }

  return token;
};

// Set anonymous token
const setAnonymousToken = (token) => {
  if (token) {
    localStorage.setItem(ANONYMOUS_TOKEN_KEY, token);
  }
};

// Clear anonymous token (on logout or explicit clear)
const clearAnonymousToken = () => {
  localStorage.removeItem(ANONYMOUS_TOKEN_KEY);
};

const convertToFrontendFormat = (backendBoard) => {
  if (!backendBoard || !Array.isArray(backendBoard)) {
    console.warn("Invalid board data, returning empty board");
    return Array(9)
      .fill()
      .map(() => Array(9).fill(null));
  }
  return backendBoard.map((row) => {
    if (!Array.isArray(row)) {
      console.warn("Invalid row data, returning empty row");
      return Array(9).fill(null);
    }
    return row.map((cell) => (cell === 0 ? null : cell));
  });
};

const convertToBackendFormat = (frontendBoard) => {
  if (!frontendBoard || !Array.isArray(frontendBoard)) {
    return Array(9)
      .fill()
      .map(() => Array(9).fill(0));
  }
  return frontendBoard.map((row) =>
    row.map((cell) => (cell === null ? 0 : cell)),
  );
};

export const userAPI = {
  // Get or create anonymous user
  initAnonymousUser: async () => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${USER_API_URL}/anonymous`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Token": anonymousToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.anonymousToken) {
      setAnonymousToken(data.anonymousToken);
    }

    return data;
  },

  // Register (convert anonymous to registered user)
  register: async (username, email, password) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${USER_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Token": anonymousToken,
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    const data = await response.json();

    if (data.anonymousToken) {
      setAnonymousToken(data.anonymousToken);
    }

    return data;
  },

  // Login
  login: async (usernameOrEmail, password) => {
    const response = await fetch(`${USER_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usernameOrEmail, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();

    if (data.anonymousToken) {
      setAnonymousToken(data.anonymousToken);
    }

    return data;
  },

  // Get user stats
  getUserStats: async (userId) => {
    const response = await fetch(`${USER_API_URL}/${userId}/stats`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },
};

export const gameAPI = {
  // Start new game
  startGame: async (difficulty) => {
    const anonymousToken = getAnonymousToken();
    const difficultyParam = (difficulty || "MEDIUM").toUpperCase();

    const response = await fetch(
      `${API_BASE_URL}/start?difficulty=${difficultyParam}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Anonymous-Token": anonymousToken,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get token from response header
    const newToken = response.headers.get("X-Anonymous-Token");
    if (newToken) {
      setAnonymousToken(newToken);
    }

    const data = await response.json();
    console.log("📦 API startGame FULL RESPONSE:", data);

    return {
      ...data,
      puzzle: convertToFrontendFormat(data.puzzle),
      currentBoard: convertToFrontendFormat(data.currentBoard),
      solution: convertToFrontendFormat(data.solution),
    };
  },

  // Get game state
  getGame: async (gameId) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${API_BASE_URL}/${gameId}`, {
      headers: {
        "X-Anonymous-Token": anonymousToken,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Game not found");
      }
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

  // Make a move
  makeMove: async (gameId, row, col, value) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${API_BASE_URL}/${gameId}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Token": anonymousToken,
      },
      body: JSON.stringify({
        row,
        col,
        value: value || 0,
      }),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Game already completed");
      }
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

  // Undo last move
  undoMove: async (gameId) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${API_BASE_URL}/${gameId}/undo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Token": anonymousToken,
      },
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || "No moves to undo");
      }
      if (response.status === 409) {
        throw new Error("Cannot undo - game is completed");
      }
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

  // Get hint
  getHint: async (gameId) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${API_BASE_URL}/${gameId}/hint`, {
      headers: {
        "X-Anonymous-Token": anonymousToken,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        const errorText = await response.text();
        throw new Error(errorText || "No hint available");
      }
      if (response.status === 409) {
        throw new Error("Game already completed");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Validate solution
  validateSolution: async (gameId) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${API_BASE_URL}/${gameId}/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Anonymous-Token": anonymousToken,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  // Delete game
  deleteGame: async (gameId) => {
    const anonymousToken = getAnonymousToken();

    const response = await fetch(`${API_BASE_URL}/${gameId}`, {
      method: "DELETE",
      headers: {
        "X-Anonymous-Token": anonymousToken,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Game not found");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  },
};

// Initialize anonymous user on app load
export const initializeApp = async () => {
  try {
    const user = await userAPI.initAnonymousUser();
    console.log("✅ Anonymous user initialized:", user);
    return user;
  } catch (error) {
    console.error("❌ Failed to initialize anonymous user:", error);
    return null;
  }
};

// Export helper functions
export { getAnonymousToken, setAnonymousToken, clearAnonymousToken };
