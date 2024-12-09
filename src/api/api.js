import axios from "axios";
import router from "@/router/index.js";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base URL for the backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Интерсепторы для запросов
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсепторы для ответов
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      alert("Ошибка подключения к серверу. Проверьте доступность сервера.");
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

const api = {
  // Set the network
  async setNetwork(network) {
    try {
      const response = await apiClient.post(`/set-network?network=${network}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error setting network");
    }
  },

  // Get current network
  async getNetwork() {
    try {
      const response = await apiClient.get("/get-network");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error getting network");
    }
  },

  // Transfer funds
  async transferFunds(fromPrivateKey, toAddress, amount, useToken = false) {
    try {
      const response = await apiClient.post("/transfer-funds", {
        fromPrivateKey,
        toAddress,
        amount,
        useToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error transferring funds");
    }
  },

  // Transfer all funds to the main wallet
  async transferAllToMain(useToken = false) {
    try {
      const response = await apiClient.post("/transfer-all", { useToken });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error transferring all funds");
    }
  },

  // Distribute funds equally
  async distributeEqual(amountPerWallet, useToken = false) {
    try {
      const response = await apiClient.post("/distribute-equal", {
        amountPerWallet,
        useToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error distributing funds equally");
    }
  },

  // Distribute funds randomly
  async distributeRandom(minValue, maxValue, decimals = 2, useToken = false) {
    try {
      const response = await apiClient.post("/distribute-random", {
        minValue,
        maxValue,
        decimals,
        useToken,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error distributing funds randomly");
    }
  },

  // Get balances of all wallets
  async getBalances(network) {
    try {
      const response = await apiClient.get(`/balances/${network || ""}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error fetching balances");
    }
  },

  // Get balance of a specific wallet
  async getBalance(network, address) {
    try {
      const response = await apiClient.get(`/balance/${network || ""}/${address}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Error fetching balance");
    }
  },

  // Get token symbol
  async getTokenSymbol(network) {
    try {
      const response = await apiClient.get(`/token-symbol${network ? ("/" + network) : ""}`);
      return response.data.symbol;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при получении символа токена");
    }
  },

  // Enable whitelist
  async enableWhitelist() {
    try {
      const response = await apiClient.post("/whitelist/enable");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при включении вайтлиста");
    }
  },

  // Disable whitelist
  async disableWhitelist() {
    try {
      const response = await apiClient.post("/whitelist/disable");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при отключении вайтлиста");
    }
  },

  // Add to whitelist
  async addToWhitelist(account) {
    if (!account) throw new Error("Не указан адрес аккаунта.");
    try {
      const response = await apiClient.post("/whitelist/add", { account });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при добавлении в вайтлист");
    }
  },

  // Remove from whitelist
  async removeFromWhitelist(account) {
    if (!account) throw new Error("Не указан адрес аккаунта.");
    try {
      const response = await apiClient.post("/whitelist/remove", { account });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при удалении из вайтлиста");
    }
  },

  // Add many to whitelist
  async addManyToWhitelist(accounts) {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("Массив адресов обязателен и не может быть пустым.");
    }
    try {
      const response = await apiClient.post("/whitelist/addMany", { accounts });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при добавлении множества аккаунтов в вайтлист");
    }
  },

  // Remove many from whitelist
  async removeManyFromWhitelist(accounts) {
    if (!Array.isArray(accounts) || accounts.length === 0) {
      throw new Error("Массив адресов обязателен и не может быть пустым.");
    }
    try {
      const response = await apiClient.post("/whitelist/removeMany", { accounts });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при удалении множества аккаунтов из вайтлиста");
    }
  },

  // Check if whitelist is enabled
  async isWhitelistEnabled() {
    try {
      const response = await apiClient.get("/whitelist/status");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при получении статуса вайтлиста");
    }
  },

  // Check if account is in whitelist
  async checkWhitelist(account) {
    if (!account) throw new Error("Не указан адрес аккаунта.");
    try {
      const response = await apiClient.get(`/whitelist/check/${account}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Ошибка при проверке статуса аккаунта в вайтлисте");
    }
  },
};

export default api;
