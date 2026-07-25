import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../axios";


export const conversationStore = create((set) => ({
    conversations: [],
    selectedConversation: null,
    isCreatingConversation: false,
    isLoadingConversations: false,
    isUpdatingConversation: false,

    getConversations: async () => {
        set({ isLoadingConversations: true });
        try {
            const { data } = await axiosInstance.get("/chat/get-conversations");
            set({ conversations: data.conversations });
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isLoadingConversations: false });
        }
    },

    createConversation: async () => {
        set({ isCreatingConversation: true });
        try {
            const { data } = await axiosInstance.post("/chat/create-conversation");

            set((state) => ({
                conversations: [data.conversation, ...state.conversations],
                selectedConversation: data.conversation,
            }));
            return data.conversation;

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isCreatingConversation: false });
        }
    },

    updateConversation: async (conversationId, title) => {
        set({ isUpdatingConversation: true });
        try {
            const { data } = await axiosInstance.post("/chat/update-conversation", { conversationId, title });
            set((state) => ({
                conversations: state.conversations.map((conversation) =>
                    conversation._id === conversationId ? data.conversation : conversation),
                selectedConversation:
                    state.selectedConversation?._id === conversationId ? data.conversation : state.selectedConversation,
            }));

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            set({ isUpdatingConversation: false });
        }
    },

    setSelectedConversation: (conversation) => {
        set({ selectedConversation: conversation });
    },

    deleteConversation: async (conversationId) => {
        try {
            await axiosInstance.delete(`/chat/delete-conversation/${conversationId}`);
            set((state) => ({
                conversations: state.conversations.filter((conversation) => conversation._id !== conversationId),
                selectedConversation: state.selectedConversation?._id === conversationId ? null : state.selectedConversation,
            }));
            toast.success("Conversation deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    },
}));