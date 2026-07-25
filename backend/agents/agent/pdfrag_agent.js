const fs = require("fs/promises");
const pdf = require("pdf-parse");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { getModel } = require("../../models/LlmModel");


module.exports.pdfRagAgent = async (state) => {
    try {
        const llm = getModel("pdf");
        const buffer = await fs.readFile(state.file.path);
        const result = await pdf(buffer);
        const text = result.text;
        if (!text.trim()) {
            return { ...state, aiResponse: "❌ Couldn't extract any text from the PDF." };
        }

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
        const docs = await splitter.createDocuments([text]);
        const queryWords = state.prompt.toLowerCase().split(/\W+/).filter(Boolean);

        const scoredDocs = docs.map((doc) => {
            const chunk = doc.pageContent.toLowerCase();
            let score = 0;
            for (const word of queryWords) {
                if (chunk.includes(word)) score++;
            }
            return { score, content: doc.pageContent };
        })
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const context = scoredDocs.map((doc) => doc.content).join("\n\n---------------------\n\n");
        const messages = [
            new SystemMessage(`
            You are KryptAI PDF Assistant.

            Rules:

            - Answer ONLY using the provided PDF context.
            - Never invent information.
            - If the answer is not present, reply:

            "I couldn't find this information in the uploaded PDF."

            - Use Markdown formatting.
            `),

            new HumanMessage(`
            PDF Context:

            ${context}

            Question:

            ${state.prompt}
            `)
        ];

        const response = await llm.invoke(messages);
        return { ...state, aiResponse: response.content };
    }
    catch (error) {
        console.error("PDF RAG Error:", error);
        return { ...state, aiResponse: "❌ Failed to analyze the PDF." };
    }
    finally {
        if (state.file) {
            try {
                await fs.unlink(state.file.path);
                console.log("Deleted:", state.file.path);
            }
            catch (err) {
                console.log(err.message);
            }
        }
    }
};