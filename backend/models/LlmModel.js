const dotenv = require("dotenv");
dotenv.config();
const { ChatGroq } = require("@langchain/groq");
const { ChatOpenRouter } = require("@langchain/openrouter");


const groq = new ChatGroq({ model: "llama-3.3-70b-versatile", temperature: 0, maxTokens: undefined, maxRetries: 2, apiKey: process.env.GROQ_API_KEY });
const code_openRouter = new ChatOpenRouter({ model: "deepseek/deepseek-chat", temperature: 0, maxTokens: 2500, apiKey: process.env.OPENROUTER_API_KEY });
const vision_openRouter = new ChatOpenRouter({ model: "google/gemma-4-26b-a4b-it:free", temperature: 0, apiKey: process.env.OPENROUTER_API_KEY });


module.exports.getModel = (agent) => {
    switch (agent) {
        case "coding":
            return code_openRouter;
        case "search":
            return groq;
        case "chat":
            return groq;
        case "vision":
            return vision_openRouter;
        case "image":
            return groq;
        case "pdf":
            return groq;
        case "ppt":
            return groq;
        default:
            return groq;
    }
};