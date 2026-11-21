import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
        query: state.prompt
    })
    console.log("Search results:", results);

    const searchContext = (results.results || [])
      .slice(0, 5)
      .map((result) => {
        const title = result.title || "Untitled";
        const url = result.url || "";
        const content = String(result.content || "").slice(0, 500);
        return `${title}\n${url}\n${content}`;
      })
      .join("\n\n");

    return {
        ...state,
        searchResults: results,
        searchContext,
        images: results.images || []
    };
    } catch (error) {
        return {
            ...state,
            searchResults: [],
            searchContext: "",
            images: [],
        };
  }
};