import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../axios";


export const messageStore = create((set, get) => ({
    messages: [],
    isLoadingMessages: false,
    isSendingMessage: false,
    currentAgent: null,

    getMessages: async (conversationId) => {
        set({ isLoadingMessages: true });
        try {
            const { data } = await axiosInstance.get(`/chat/get-messages/${conversationId}`);
            set({ messages: data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isLoadingMessages: false });
        }
    },

    sendMessage: async (conversationId, prompt, agent, file = null) => {
        set({ isSendingMessage: true, currentAgent: agent });
        try {
            const formData = new FormData();
            formData.append("conversationId", conversationId);
            formData.append("prompt", prompt);
            formData.append("agent", agent);
            if (file) {
                formData.append("file", file);
            }

            const { data } = await axiosInstance.post("/chat/chat", formData);
            await get().getMessages(conversationId);
            return data.response;

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isSendingMessage: false, currentAgent: null });
        }
    },

    clearMessages: () => {
        set({ messages: [] });
    },
}));