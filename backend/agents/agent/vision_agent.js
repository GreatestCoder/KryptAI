const fs = require("fs/promises");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const { getModel } = require("../../models/LlmModel");


module.exports.visionAgent = async (state) => {
    try {
        const llm = getModel("vision");
        const imageBuffer = await fs.readFile(state.file.path);
        const base64Image = imageBuffer.toString("base64");

        const messages = [
            new SystemMessage(`
You are KryptAI Vision Agent.

You can:

• Describe images
• Answer questions about the image
• OCR printed or handwritten text
• Explain charts and graphs
• Explain diagrams
• Explain UI screenshots
• Explain code screenshots
• Solve questions shown in images
• Analyze documents

Rules:

- Only use information visible in the image.
- If something cannot be determined, explicitly say so.
- Never invent missing information.
- Format responses in Markdown.
`),

            new HumanMessage({
                content: [
                    {
                        type: "text",
                        text: state.prompt || "Describe this image.",
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${state.file.mimetype};base64,${base64Image}`,
                        },
                    },
                ],
            }),
        ];

        const response = await llm.invoke(messages);
        return { ...state, aiResponse: response.content };
    } catch (error) {
        console.log(error);
    }
};