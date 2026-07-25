const { StateGraph } = require("@langchain/langgraph");
const agentState = require("./state");
const { router } = require("./router");
const { chatAgent } = require("../agent/chat_agent");
const { searchAgent } = require("../agent/search_agent");
const { codingAgent } = require("../agent/coding_agent");
const { pdfAgent } = require("../agent/pdf_agent");
const { pptAgent } = require("../agent/ppt_agent");
const { visionAgent } = require("../agent/vision_agent");
const { imageGenAgent } = require("../agent/image_agent");
const { pdfRagAgent } = require("../agent/pdfrag_agent");


const workflow = new StateGraph(agentState);

workflow.addNode("router", router);
workflow.addNode("chat", chatAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("vision", visionAgent);
workflow.addNode("image", imageGenAgent);
workflow.addNode("pdf_rag", pdfRagAgent);

workflow.addEdge("__start__", "router");

workflow.addConditionalEdges("router", (state) => {
    switch (state.agent) {
        case "search":
            return "search";
        case "coding":
            return "coding";
        case "pdf":
            return "pdf";
        case "ppt":
            return "ppt";
        case "vision":
            return "vision";
        case "image":
            return "image";
        case "pdf_rag":
            return "pdf_rag";
        default:
            return "chat";
    }
},
    { chat: "chat", search: "search", coding: "coding", pdf: "pdf", ppt: "ppt", vision: "vision", image: "image", pdf_rag: "pdf_rag" }
);

workflow.addEdge("coding", "__end__");
workflow.addEdge("search", "chat");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("chat", "__end__");
workflow.addEdge("vision", "__end__");
workflow.addEdge("image", "__end__");
workflow.addEdge("pdf_rag", "__end__");


const graph = workflow.compile();
module.exports = graph;