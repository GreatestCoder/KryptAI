const { TavilySearch } = require("@langchain/tavily");


const searchTool = new TavilySearch({maxResults: 5, topic: "general", includeImages:true});
module.exports = searchTool;