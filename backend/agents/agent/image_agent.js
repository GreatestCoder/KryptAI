const { getModel } = require("../../models/LlmModel");


module.exports.imageGenAgent = async (state) => {
    try {
        const llm = getModel("image");
        const promptResponse = await llm.invoke(`
You are KryptAI's prompt engineering assistant.

Convert the user's request into a highly detailed image generation prompt.

Requirements:

- Ultra realistic
- Cinematic lighting
- Professional composition
- Beautiful colors
- Sharp focus
- Highly detailed
- 8K quality

Return ONLY the prompt.

User request:

${state.prompt}
`);

        const enhancedPrompt = promptResponse.content.trim();
        const imageUrl =
            `https://image.pollinations.ai/prompt/${encodeURIComponent(
                enhancedPrompt
            )}`;

        return { ...state, aiResponse: "✅ Image generated successfully.", images: [imageUrl] };
    } catch (err) {
        console.error(err);
        return { ...state, aiResponse: "❌ Failed to generate image." };
    }
};