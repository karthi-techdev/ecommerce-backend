
// import { create } from "zustand";
// import axios from "axios";
// import { type LoginFormData } from "../components/validations/authValidation";

// interface AdminData {
//   name: string;
//   email: string;
//   role: string;
// }

// interface AuthState {
//   token: string | null;
//   admin: AdminData | null;
//   isAuthenticated: boolean;

//   login: (data: LoginFormData) => Promise<void>;
//   logout: () => void;
//   refreshToken: () => Promise<boolean>;
//   startTokenMonitor: () => void;
// }

// const API_URL = "http://localhost:5000/api/v1/admin/auth";

// export const useAuthStore = create<AuthState>((set, get) => ({
//   token: localStorage.getItem("adminToken"),
//   admin: JSON.parse(localStorage.getItem("adminData") || "null"),
//   isAuthenticated: !!localStorage.getItem("adminToken"),

//   login: async (formData) => {
//     const res = await axios.post(`${API_URL}/login`, formData);

//     if (res.data.status === true) {
//       const { token, admin } = res.data.data;

//       localStorage.setItem("adminToken", token);
//       localStorage.setItem("adminData", JSON.stringify(admin));

//       set({
//         token,
//         admin,
//         isAuthenticated: true
//       });

//       get().startTokenMonitor();
//     }
//   },

//   refreshToken: async () => {
//     try {
//       const token = localStorage.getItem("adminToken");
//       if (!token) return false;

//       const res = await axios.post(
//         `${API_URL}/refresh`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       if (res.data.status === true) {
//         const newToken = res.data.token;

//         localStorage.setItem("adminToken", newToken);

//         set({ token: newToken });

//         return true;
//       }

//       return false;
//     } catch {
//       return false;
//     }
//   },

//   startTokenMonitor: () => {
//     setInterval(async () => {
//       const token = localStorage.getItem("adminToken");
//       if (!token) return;

//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));

//         const expTime = payload.exp * 1000;
//         const currentTime = Date.now();
//         const timeLeft = expTime - currentTime;

//         if (timeLeft <= 60000 && timeLeft > 0) {

//           const stayLoggedIn = window.confirm(
//             "⚠ Session expiring in 1 minute. Stay logged in?"
//           );

//           if (stayLoggedIn) {

//             const refreshed = await get().refreshToken();

//             if (!refreshed) {
//               get().logout();
//             }

//           } else {

//             setTimeout(() => {
//               get().logout();
//             }, 60000);

//           }
//         }

//         if (timeLeft <= 0) {
//           get().logout();
//         }

//       } catch {
//         get().logout();
//       }

//     }, 30000);
//   },

  
//   logout: () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminData");

//     set({
//       token: null,
//       admin: null,
//       isAuthenticated: false
//     });

//     window.location.href = "/login";
//   }

// }));

import { create } from "zustand";
import axios from "axios";
import Swal from "sweetalert2";
import { type LoginFormData } from "../components/validations/authValidation";

interface AdminData {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  admin: AdminData | null;
  isAuthenticated: boolean;

  login: (data: LoginFormData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  startTokenMonitor: () => void;
}

const API_URL = "http://localhost:5000/api/v1/admin/auth";

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem("adminToken"),
  admin: JSON.parse(localStorage.getItem("adminData") || "null"),
  isAuthenticated: !!localStorage.getItem("adminToken"),

  login: async (formData) => {
    const res = await axios.post(`${API_URL}/login`, formData);

    if (res.data.status === true) {
      const { token, admin } = res.data.data;

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminData", JSON.stringify(admin));

      set({
        token,
        admin,
        isAuthenticated: true
      });

      get().startTokenMonitor();
    }
  },

  refreshToken: async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return false;

      const res = await axios.post(
        `${API_URL}/refresh`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.status === true) {
        const newToken = res.data.token;

        localStorage.setItem("adminToken", newToken);
        set({ token: newToken });

        return true;
      }

      return false;
    } catch {
      return false;
    }
  },

  startTokenMonitor: () => {
    setInterval(async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const expTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeLeft = expTime - currentTime;

        if (timeLeft <= 60000 && timeLeft > 0) {

          const result = await Swal.fire({
            title: "Session Expiring Soon",
            text: "Your session will expire in 1 minute. Stay logged in?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Stay Logged In",
            cancelButtonText: "Logout",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            allowOutsideClick: false,
            allowEscapeKey: false
          });

          if (result.isConfirmed) {

            const refreshed = await get().refreshToken();

            if (!refreshed) {
              get().logout();
            }

          } else {

            get().logout();

          }
        }

        if (timeLeft <= 0) {
          get().logout();
        }

      } catch {
        get().logout();
      }

    }, 30000);
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    set({
      token: null,
      admin: null,
      isAuthenticated: false
    });

    window.location.replace("/login");
  }

}));

