import { useRef, useState } from "react";
import { Send, Zap, MessagesSquare, Code2, FileText, Presentation, ImageIcon, Globe, Paperclip, X, ImagePlayIcon, LoaderCircle } from "lucide-react";
import { conversationStore } from "../lib/stores/conversationStore";
import { messageStore } from "../lib/stores/messageStore";


export default function ChatInput() {
    const [selectedAgent, setSelectedAgent] = useState("auto");
    const [prompt, setPrompt] = useState("");
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);
    const { selectedConversation, createConversation, updateConversation } = conversationStore();
    const { sendMessage, isSendingMessage } = messageStore();

    const canUpload =
        selectedAgent === "auto" ||
        selectedAgent === "vision" ||
        selectedAgent === "pdf";

    const accept =
        selectedAgent === "vision"
            ? "image/*"
            : selectedAgent === "pdf"
                ? ".pdf"
                : "image/*,.pdf";

    const handleSend = async () => {
        if ((!prompt.trim() && !file) || isSendingMessage) return;
        let conversation = selectedConversation;
        if (!conversation) {
            conversation = await createConversation();
        }

        if (conversation.title === "New Chat") {
            await updateConversation(
                conversation._id,
                prompt.trim()
                    ? prompt.slice(0, 40)
                    : file?.type.startsWith("image/")
                        ? "Image Chat"
                        : "PDF Chat"
            );
        }

        let agentToUse = selectedAgent;

        if (file) {
            if (selectedAgent === "auto") {
                if (file.type.startsWith("image/")) {
                    agentToUse = "vision";
                } else if (file.type === "application/pdf") {
                    agentToUse = "pdf_rag";
                }
            } else if (selectedAgent === "pdf") {
                agentToUse = "pdf_rag";
            }
        }

        await sendMessage(conversation._id, prompt, agentToUse, file);
        setPrompt("");
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const agents = [
        { id: "auto", icon: Zap, label: "Auto" },
        { id: "chat", icon: MessagesSquare, label: "Chat" },
        { id: "coding", icon: Code2, label: "Coding" },
        { id: "pdf", icon: FileText, label: "PDF" },
        { id: "ppt", icon: Presentation, label: "PPT" },
        { id: "vision", icon: ImageIcon, label: "Vision" },
        { id: "search", icon: Globe, label: "Search" },
        { id: "image", icon: ImagePlayIcon, label: "Generate" },
    ];

    return (
        <div className="border-t border-slate-800 bg-slate-950 p-4">

            <input ref={fileInputRef} hidden type="file" accept={accept}
                onChange={(e) => {
                    if (e.target.files?.length) {
                        setFile(e.target.files[0]);
                    }
                }}
            />

            <div className="rounded-2xl border border-slate-700/70 bg-slate-900 shadow-lg shadow-black/20 p-3">

                <div className="mb-3 flex flex-wrap gap-2">
                    {agents.map((agent) => {
                        const Icon = agent.icon;
                        const isActive = selectedAgent === agent.id;

                        return (
                            <button key={agent.id} type="button"
                                onClick={() => {
                                    setSelectedAgent(agent.id);
                                    setFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition
                                ${isActive ? "bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white" : "bg-slate-900 border border-slate-700 text-slate-400 hover:bg-slate-700"}`}
                            >
                                <Icon size={14} />
                                {agent.label}
                            </button>
                        );
                    })}
                </div>

                {file && (
                    <div className="mb-3 flex items-center justify-between rounded-xl bg-slate-800 px-4 py-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                            {file.type.startsWith("image/") ? (
                                <ImageIcon size={16} className="shrink-0 text-emerald-400" />
                            ) : (
                                <FileText size={16} className="shrink-0 text-indigo-400" />
                            )}
                            <span className="truncate text-sm text-slate-200">{file.name}</span>
                        </div>

                        <button
                            onClick={() => {
                                setFile(null);
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                }
                            }}
                            className="rounded p-1 text-slate-400 transition hover:bg-slate-700 hover:text-red-400"
                        >
                            <X size={15} />
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-3">
                    <textarea rows={2} value={prompt} disabled={isSendingMessage} onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={
                            file?.type.startsWith("image/")
                                ? "Ask about the uploaded image..."
                                : file?.type === "application/pdf"
                                    ? "Ask about the uploaded PDF..."
                                    : "Ask KryptAI anything..."
                        }
                        className="flex-1 resize-none rounded-xl bg-slate-950 px-4 py-3 border border-slate-700/60 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                    />

                    {canUpload && (
                        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isSendingMessage}
                            className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:scale-105 active:scale-95 duration-200 hover:text-white"
                        >
                            <Paperclip size={18} />
                        </button>
                    )}

                    <button onClick={handleSend} disabled={(!prompt.trim() && !file) || isSendingMessage}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white transition hover:bg-emerald-400 hover:scale-105 active:scale-95 duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSendingMessage ? (
                            <LoaderCircle size={18} className="animate-spin" />
                        ) : (
                            <Send size={18} />
                        )}
                    </button>
                </div>

            </div>
            <p className="mt-2 text-center text-xs text-slate-500">KryptAI can make mistakes. Always verify important information.</p>
        </div>
    );
}