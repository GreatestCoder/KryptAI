const { SystemMessage, HumanMessage, AIMessage } = require("@langchain/core/messages");
const { getModel } = require("../../models/LlmModel");


module.exports.chatAgent = async (state) => {
    const llm = await getModel("chat");
    const searchContext = state.searchResults?.results ? state.searchResults.results
        .map((result) => `
Title: ${result.title}
Content: ${result.content}
URL: ${result.url}
`
        )
        .join("\n")
        : "";

    const messages = [new SystemMessage(`
You are KryptAI, an intelligent AI assistant.

${searchContext ? `Web Search Results:

${searchContext}

Answer the user using only the above search results.
Do not mention internal tools.
` : ""}

Rules:
- For simple questions, greetings, and short queries, respond naturally in plain text.
- For technical, educational, coding, or detailed topics, use clean Markdown.

Formatting:
- Use # for titles and ## for sections.
- Leave a blank line after headings.
- Use bullet points for lists.
- Use numbered lists for steps.
- Use fenced code blocks with language tags for code.
- Keep paragraphs short and readable.
- Never write headings and content on the same line.
- Never generate large walls of text.
`)
    ];

    if (state.memory?.length) {
        state.memory.forEach((message) => {
            if (message.role === "user") {
                messages.push(new HumanMessage(message.content));
            } else if (message.role === "assistant") {
                messages.push(new AIMessage(message.content));
            }
        });
    }

    messages.push(new HumanMessage(state.prompt));
    const response = await llm.invoke(messages);
    return { ...state, aiResponse: response.content, images: state.searchResults?.images || [] };
};