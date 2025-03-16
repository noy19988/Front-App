import axios, { AxiosError } from "axios";

// 📌 עדכון `baseURL` ללא `/api`
const apiClient = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// 📌 Interceptor לכל הבקשות - מוסיף `Authorization` אם יש `token`
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 📌 התחברות משתמש
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", { email, password });

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data && typeof axiosError.response.data === "object"
      ? (axiosError.response.data as { message?: string }).message || "Login failed"
      : "Login failed";
    
    throw errorMessage;
  }
};
  

// 📌 רישום משתמש חדש
export const signUpUser = async (username: string, email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/register", { username, email, password });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data && typeof axiosError.response.data === "object"
      ? (axiosError.response.data as { message?: string }).message || "Sign up failed"
      : "Sign up failed";
    
    throw errorMessage;
  }
};

// 📌 יציאה מהמשתמש
export const logoutUser = async () => {
  try {
    await apiClient.post("/auth/logout");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// 📌 קבלת פרטי משתמש לפי ID
export const getUserDetails = async (userId: string) => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    const errorMessage = axiosError.response?.data && typeof axiosError.response.data === "object"
      ? (axiosError.response.data as { message?: string }).message || "Failed to fetch user details"
      : "Failed to fetch user details";
    
    throw errorMessage;
  }
};


// 📌 מחיקת משתמש לפי ID
export const deleteUser = async (userId: string) => {
    try {
      await apiClient.delete(`/users/${userId}`);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } catch (error) {
      const axiosError = error as AxiosError;
      const errorMessage = axiosError.response?.data && typeof axiosError.response.data === "object"
        ? (axiosError.response.data as { message?: string }).message || "Failed to delete user"
        : "Failed to delete user";
      
      throw errorMessage;
    }
  };




  export const updateUser = async (userId: string, formData: FormData) => {
    try {
        const response = await apiClient.put(`/users/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data", // 🔹 חשוב מאוד! אומר לשרת שהבקשה מכילה קובץ
            },
        });
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        throw axiosError.response?.data?.message || "Failed to update user";
    }
};


  

// 📌 ביטול בקשות API בצורה נכונה
export const CanceledError = axios.CanceledError;
export default apiClient;
