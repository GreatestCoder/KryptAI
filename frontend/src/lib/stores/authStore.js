import { create } from "zustand";
import { signInWithPopup, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, googleProvider } from "../firebase";
import { axiosInstance } from "../axios";


export const authStore = create((set) => ({
    user: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isLoggingOut: false,

    checkAuth: async () => {
        try {
            const { data } = await axiosInstance.get("/auth/me");
            set({user: data.user});
        } catch (error) {
            set({user: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },

    login: async () => {
        set({ isLoggingIn: true });
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const token = await result.user.getIdToken();
            const { data } = await axiosInstance.post("/auth/login", {token});
            set({user: data.user});
            toast.success("Logged in successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({isLoggingIn: false});
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/auth/logout");
            await signOut(auth);
            set({user: null});
            toast.success("Logged out successfully");

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({isLoggingOut: false});
        }
    },
}));