import { LoaderCircle } from "lucide-react";


const loadingMessages = {
    auto: "Thinking...",
    chat: "Thinking...",
    search: "Searching the web...",
    coding: "Writing code...",
    vision: "Analyzing image...",
    image: "Generating image...",
    pdf: "Creating PDF...",
    pdf_rag: "Reading your PDF...",
    ppt: "Building presentation...",
};

export default function LoadingBubble({ agent }) {
    return (
        <div className="flex justify-start">
            <div className="max-w-4xl rounded-2xl bg-slate-800 px-5 py-4 text-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <LoaderCircle size={18} className="animate-spin text-emerald-400" />
                    <span className="text-sm text-slate-300">{loadingMessages[agent] || loadingMessages.auto}</span>
                </div>
            </div>
        </div>
    );
}