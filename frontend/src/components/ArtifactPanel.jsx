import { useEffect, useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Code2, Eye, Copy, Check, X, FolderCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { artifactStore } from "../lib/stores/artifactStore";
import { detectLanguage } from "../lib/detectLanguage";


export default function ArtifactPanel() {
    const { selectedArtifact, isOpen, closeArtifact } = artifactStore();
    const artifact = selectedArtifact;
    const [tab, setTab] = useState("code");
    const [activeFile, setActiveFile] = useState(0);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!artifact) return;
        setTab("code");
        setActiveFile(0);
        setCopied(false);
    }, [artifact]);

    const files = artifact?.files || [];
    const file = files[activeFile];
    const htmlFile = files.find((f) => f.name === "index.html");
    const cssFile = files.find((f) => f.name === "style.css");
    const jsFile = files.find((f) => f.name === "script.js");
    const canPreview = Boolean(htmlFile);

    const previewDoc = useMemo(() => {
        if (!htmlFile) return "";
        return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8"/>
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
        />

        <style>
        ${cssFile?.content || ""}
        </style>

        </head>

        <body>

        ${htmlFile?.content || ""}

        <script>
        ${jsFile?.content || ""}
        <\/script>

        </body>
        </html>
        `;
    }, [htmlFile, cssFile, jsFile]);

    const copyCurrentFile = async () => {
        if (!file) return;
        await navigator.clipboard.writeText(file.content);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    if (!artifact || !isOpen) {
        return null;
    }


    return (
        <AnimatePresence>
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.25 }}
                className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-3xl flex-col border-l border-slate-700 bg-[#0d1117] shadow-2xl"
            >

                <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-indigo-500/15 p-2"><FolderCode size={18} className="text-indigo-400" /></div>
                        <div>
                            <h2 className="font-semibold text-white">{artifact.title}</h2>
                            <p className="text-xs text-slate-400">{artifact.files?.length} file {artifact.files?.length > 1 ? "s" : ""}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {tab === "code" && (
                            <button onClick={copyCurrentFile}
                                className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700"
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} />
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} />
                                        Copy
                                    </>
                                )}
                            </button>
                        )}

                        <button onClick={closeArtifact}
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex border-b border-slate-700">
                    <button onClick={() => setTab("code")}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${tab === "code"
                            ? "border-b-2 border-indigo-500 text-indigo-400"
                            : "text-slate-400 hover:text-white"
                            }`}
                    >
                        <Code2 size={16} />
                        Code
                    </button>

                    {canPreview && (
                        <button onClick={() => setTab("preview")}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition ${tab === "preview"
                                ? "border-b-2 border-indigo-500 text-indigo-400"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            <Eye size={16} />
                            Preview
                        </button>
                    )}
                </div>

                {tab === "code" && (
                    <div className="flex overflow-x-auto border-b border-slate-700 bg-[#111827]">
                        {artifact.files?.map((f, index) => (
                            <button key={f.name} onClick={() => setActiveFile(index)}
                                className={`whitespace-nowrap px-4 py-3 text-sm transition ${activeFile === index
                                    ? "bg-slate-800 text-indigo-400"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                {f.name}
                            </button>
                        ))}

                    </div>
                )}


                <div className="flex-1 overflow-hidden">
                    {tab === "preview" && canPreview ? (
                        <iframe title="preview" srcDoc={previewDoc} sandbox="allow-scripts" className="h-full w-full bg-white" />
                    ) : (
                        <Editor theme="vs-dark" language={detectLanguage(file?.name || "")} value={file?.content || ""}
                            options={{
                                readOnly: true,
                                minimap: { enabled: false },
                                fontSize: 14,
                                wordWrap: "on",
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                            }}
                        />
                    )}
                </div>

            </motion.div>
        </AnimatePresence>
    );
}