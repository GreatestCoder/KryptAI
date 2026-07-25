const { Annotation } = require("@langchain/langgraph");


const agentState = Annotation.Root({
    prompt: Annotation(), memory: Annotation(), aiResponse: Annotation(), agent: Annotation(),
    searchResults: Annotation(), images: Annotation(), artifacts: Annotation(), file: Annotation(),
    codeContext: Annotation(), pdfContext: Annotation()
});
module.exports = agentState;