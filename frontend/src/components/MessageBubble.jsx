import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check, X, FolderCode } from "lucide-react";
import { artifactStore } from "../lib/stores/artifactStore";
import { motion } from "framer-motion";


export default function MessageBubble({ role, content, images = [], artifacts = [] }) {
    const isUser = role === "user";
    const [copied, setCopied] = useState("");
    const [lightboxImage, setLightboxImage] = useState(null);
    const { openArtifact } = artifactStore();
    const [loadedImages, setLoadedImages] = useState({});

    const copyCode = async (code) => {
        await navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => {
            setCopied("");
        }, 2000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-4xl rounded-2xl px-5 py-3 shadow-sm ${isUser
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-900 border border-slate-700/60 text-slate-100"
                    }`}
            >
                {images.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-3">
                        {images.map((image, index) => (
                            <div key={index} className="relative h-32 w-48 overflow-hidden rounded-xl">
                                {!loadedImages[image] && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-700 animate-pulse">
                                        <div className="h-full w-full animate-pulse bg-slate-700" />
                                        <p className="mt-2 text-xs text-slate-300">Loading image...</p>
                                    </div>
                                )}

                                <img
                                    src={image}
                                    alt=""
                                    loading="lazy"
                                    onClick={() => setLightboxImage(image)}
                                    onLoad={() =>
                                        setLoadedImages(prev => ({
                                            ...prev,
                                            [image]: true,
                                        }))
                                    }
                                    onError={(e) => e.currentTarget.remove()}
                                    className={`h-32 w-48 object-cover cursor-pointer transition-all duration-300 hover:opacity-90 ${loadedImages[image]
                                        ? "opacity-100"
                                        : "opacity-0"
                                        }`}
                                />
                            </div>
                        ))}
                    </div>
                )}
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ children }) => (
                            <h1 className="text-2xl font-bold mb-4">
                                {children}
                            </h1>
                        ),

                        h2: ({ children }) => (
                            <h2 className="text-xl font-semibold mb-3">
                                {children}
                            </h2>
                        ),

                        h3: ({ children }) => (
                            <h3 className="text-lg font-semibold mb-2">
                                {children}
                            </h3>
                        ),

                        p: ({ children }) => (
                            <p className="mb-3 leading-7">
                                {children}
                            </p>
                        ),

                        ul: ({ children }) => (
                            <ul className="list-disc pl-6 mb-3 space-y-1">
                                {children}
                            </ul>
                        ),

                        ol: ({ children }) => (
                            <ol className="list-decimal pl-6 mb-3 space-y-1">
                                {children}
                            </ol>
                        ),

                        table: ({ children }) => (
                            <div className="overflow-x-auto my-4">
                                <table className="min-w-full border border-slate-700">
                                    {children}
                                </table>
                            </div>
                        ),

                        th: ({ children }) => (
                            <th className="border border-slate-700 bg-slate-700 px-3 py-2 text-left">
                                {children}
                            </th>
                        ),

                        td: ({ children }) => (
                            <td className="border border-slate-700 px-3 py-2">
                                {children}
                            </td>
                        ),

                        a: ({ href, children }) => (
                            <a
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 underline hover:text-emerald-300"
                            >
                                {children}
                            </a>
                        ),

                        code({ className, children }) {
                            const value = String(children).replace(/\n$/, "");

                            if (!className) {
                                return (
                                    <code className="bg-slate-900 px-1.5 py-0.5 rounded text-emerald-300">
                                        {value}
                                    </code>
                                );
                            }



                            const language = className?.replace("language-", "") || "text";

                            return (
                                <div className="my-4 overflow-hidden rounded-xl border border-slate-700">

                                    <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-700">

                                        <span className="text-xs uppercase text-slate-400">
                                            {language}
                                        </span>

                                        <button
                                            onClick={() => copyCode(value)}
                                            className="flex items-center gap-1 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                                        >
                                            {copied === value ? (
                                                <>
                                                    <Check size={14} />
                                                    Copied
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={14} />
                                                    Copy
                                                </>
                                            )}
                                        </button>

                                    </div>

                                    <SyntaxHighlighter
                                        language={language}
                                        style={oneDark}
                                        wrapLongLines
                                        customStyle={{
                                            margin: 0,
                                            padding: "16px",
                                            background: "#0f172a",
                                            fontSize: "14px",
                                        }}
                                    >
                                        {value}
                                    </SyntaxHighlighter>

                                </div>
                            );
                        },

                        img: ({ src }) => {
                            if (!src) return null;
                            return (
                                <img
                                    src={src}
                                    alt=""
                                    onError={(e) => e.currentTarget.remove()}
                                    loading="lazy"
                                    onClick={() => setLightboxImage(src)}
                                    className="mt-3 max-w-sm rounded-xl cursor-pointer hover:opacity-90 transition"
                                />
                            );
                        },
                    }}
                >
                    {content}
                </ReactMarkdown>
                {
                    !isUser && artifacts?.length > 0 && (

                        <button onClick={() => openArtifact(artifacts[0])}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition"
                        >
                            <FolderCode size={16} />
                            View Project
                        </button>
                    )
                }
            </div>
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        onClick={() => setLightboxImage(null)}
                        className="absolute right-6 top-6 rounded-full bg-slate-800 p-2 text-white"
                    >
                        <X size={20} />
                    </button>

                    <img
                        src={lightboxImage}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90vh] max-w-[90vw] rounded-2xl"
                    />
                </div>
            )}
        </motion.div>
    );
}