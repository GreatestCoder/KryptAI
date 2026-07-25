const { getModel } = require("../../models/LlmModel");


module.exports.router = async (state) => {
    if (state.agent && state.agent !== "auto") {
        return { ...state, agent: state.agent };
    }
    if (state.file?.mimetype?.startsWith("image/")) {
        return { ...state, agent: "vision" };
    }
    if (state.file?.mimetype === "application/pdf") {
        return { ...state, agent: "pdf_rag" };
    }

    const llm = getModel("router");
    const result = await llm.invoke(`
You are KryptAI's routing agent.

Your job is to choose the single best agent.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- image

Rules:

chat:
General conversation, explanations, brainstorming, learning, writing, summarization.

search:
Current events, news, recent information, internet lookup.

coding:
Programming, debugging, algorithms, software architecture, APIs.

pdf:
Generate PDF documents.

ppt:
Generate PowerPoint presentations.

image:
Generate AI images from text prompts.

Return ONLY one of these words:

chat
search
coding
pdf
ppt
image

User Request:

${state.prompt}
`);

    return { ...state, agent: result.content.trim().toLowerCase() };
};