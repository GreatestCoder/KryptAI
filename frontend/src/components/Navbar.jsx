import { MessageSquare } from "lucide-react";
import { conversationStore } from "../lib/stores/conversationStore";
import { messageStore } from "../lib/stores/messageStore";


export default function Navbar() {
    const { selectedConversation } = conversationStore();
    const { messages } = messageStore();

    return (
        <header className="h-14 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950">
            <div className="flex items-center gap-3">

                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <MessageSquare size={16} className="text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-sm font-semibold text-white">{selectedConversation?.title || "Select a Conversation"}</h2>
                    <p className="text-xs text-slate-400">
                        {selectedConversation ? `${messages.length} message${messages.length !== 1 ? "s" : ""}`
                            : "Start a new chat or select one from the sidebar"}
                    </p>
                </div>

            </div>
        </header>
    );
}