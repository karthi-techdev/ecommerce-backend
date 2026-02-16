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

let tokenInterval: any = null;
let alertShown = false;

export const useAuthStore = create<AuthState>((set, get) => {

  const startMonitorInternal = () => {

    if (tokenInterval) return; 

    tokenInterval = setInterval(async () => {

      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));

        const expTime = payload.exp * 1000;
        const timeLeft = expTime - Date.now();

        if (timeLeft <= 60000 && timeLeft > 0 && !alertShown) {

          alertShown = true;

          const result = await Swal.fire({
            title: "Session Expiring",
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

            if (!refreshed) get().logout();

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
  };

  if (localStorage.getItem("adminToken")) {
    startMonitorInternal();
  }

  return {

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

        startMonitorInternal(); 
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
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (res.data.status === true) {

          localStorage.setItem("adminToken", res.data.token);
          set({ token: res.data.token });

          alertShown = false; 
          return true;
        }

        return false;

      } catch {
        return false;
      }
    },

    startTokenMonitor: startMonitorInternal,

    logout: () => {

      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");

      if (tokenInterval) {
        clearInterval(tokenInterval);
        tokenInterval = null;
      }

      alertShown = false;

      set({
        token: null,
        admin: null,
        isAuthenticated: false
      });

      window.location.replace("/login");
    }

  };

});
