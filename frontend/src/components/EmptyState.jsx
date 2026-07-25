import { MessagesSquare, Code2, Globe, ImagePlayIcon, FileText, Presentation, Sparkles } from "lucide-react";


export default function EmptyState({ hasConversation }) {
    const features = [
        { icon: MessagesSquare, label: "Chat" },
        { icon: Code2, label: "Coding" },
        { icon: Globe, label: "Search" },
        { icon: ImagePlayIcon, label: "Images" },
        { icon: FileText, label: "PDF" },
        { icon: Presentation, label: "PPT" },
    ];

    return (
        <div className="flex h-full items-center justify-center px-6">
            <div className="max-w-xl text-center">

                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                    <Sparkles size={30} className="text-emerald-400" />
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-white">Welcome to KryptAI</h2>
                <p className="mt-3 text-slate-400 leading-7">
                    {hasConversation
                        ? "Send your first message to begin the conversation."
                        : "Select a conversation from the sidebar or create a new chat to get started."}
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    {features.map(({ icon: Icon, label }) => (
                        <div key={label}
                            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300"
                        >
                            <Icon size={15} />
                            {label}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}