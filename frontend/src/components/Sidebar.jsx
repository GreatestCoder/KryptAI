import { useEffect } from "react";
import { Plus, MessageSquare, LogOut, Trash2 } from "lucide-react";
import { authStore } from "../lib/stores/authStore";
import { conversationStore } from "../lib/stores/conversationStore";
import { messageStore } from "../lib/stores/messageStore";


export default function Sidebar() {
    const { user, logout } = authStore();
    const { conversations, selectedConversation, getConversations, createConversation, setSelectedConversation, deleteConversation } = conversationStore();
    const { getMessages, clearMessages } = messageStore();

    useEffect(() => {
        if (user) {
            getConversations();
        }
    }, [user]);

    const handleNewChat = async () => {
        const conversation = await createConversation();
        if (!conversation) return;
        clearMessages();
    };

    const handleConversationClick = async (conversation) => {
        setSelectedConversation(conversation);
        await getMessages(conversation._id);
    };

    const handleDeleteConversation = async (e, conversation) => {
        e.stopPropagation();
        await deleteConversation(conversation._id);
        if (selectedConversation?._id === conversation._id) {
            setSelectedConversation(null);
            clearMessages();
        }
    };

    return (
        <aside className="w-72 h-screen bg-slate-950 border-r border-slate-800 flex flex-col">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">KryptAI</h1>
                <p className="text-sm text-slate-400 mt-1">Your personal AI Assistant, fresh from the Grave!!!</p>

                <button onClick={handleNewChat}
                    className="mt-6 w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-500 transition-all duration-200 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] py-3 text-white font-medium cursor-pointer">
                    <Plus size={18} />
                    New Chat
                </button>
            </div>


            <div className="flex-1 overflow-y-auto p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Recent Chats</p>
                <div className="space-y-2">
                    {conversations.length === 0 ? (<p className="text-sm text-slate-500">No conversations yet.</p>) : (
                        conversations.map((conversation) => (
                            <div
                                key={conversation._id}
                                className={`group relative flex items-center justify-between rounded-lg overflow-hidden transition-all duration-200 ${selectedConversation?._id === conversation._id
                                    ? "bg-emerald-500/10"
                                    : "hover:bg-slate-800 hover:translate-x-1"
                                    }`}
                            >
                                {selectedConversation?._id === conversation._id && (
                                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-400" />
                                )}
                                <button
                                    onClick={() => handleConversationClick(conversation)}
                                    className={`flex flex-1 items-center gap-3 p-3 text-left cursor-pointer overflow-hidden ${selectedConversation?._id === conversation._id
                                        ? "text-emerald-400"
                                        : "text-slate-300"
                                        }`}
                                >
                                    <MessageSquare size={18} className="shrink-0" />
                                    <span className="flex-1 min-w-0 truncate">{conversation.title}</span>
                                </button>

                                <button
                                    onClick={(e) => handleDeleteConversation(e, conversation)}
                                    className="mr-3 shrink-0 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-500 hover:scale-110 transition cursor-pointer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>


            {user && (
                <div className="border-t border-slate-800 p-4">
                    <div className="flex items-center gap-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full ring-2 ring-slate-800" />
                        <div className="flex-1 overflow-hidden">
                            <p className="font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                        </div>
                        <button onClick={logout} className="text-slate-400 hover:text-red-400 hover:scale-110 transition cursor-pointer">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            )}


        </aside>
    );
}