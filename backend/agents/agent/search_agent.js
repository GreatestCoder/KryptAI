const searchTool = require("../../lib/tavily");


module.exports.searchAgent = async (state) => {
    try {
        const searchResults = await searchTool.invoke({ query: state.prompt });
        return { ...state, searchResults };
    } catch (error) {
        console.error("Search Agent Error:", error);
        return { ...state, searchResults: [] };
    }
};