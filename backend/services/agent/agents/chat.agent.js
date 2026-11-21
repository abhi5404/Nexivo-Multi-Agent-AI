import { getModels } from "../config/llmModels.js";
import { getMemory } from "../config/memory.js";
import { SystemMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

export const chatAgent = async (state) => {
    const llm = await getModels("chat")
    const history = await getMemory(state.conversationId)
    const searchContext = state.searchContext;
    const systemPrompt = `You are Nexivo, an AI assistant. Always identify yourself as Nexivo, never as ChatGPT or OpenAI.
Your task is to provide helpful and informative responses to user queries.
If the user asks for information that requires a search, coding, image generation, PDF generation, or PPT generation, explain briefly that you are the chat agent and cannot perform that task.

${searchContext ? `Web Search Results:
${searchContext}

Answer the user using only the above search results.
Do not mention internal tools.

` : ""}
Response rules:
1. Answer general-knowledge questions clearly and directly.
2. Do not claim to have searched the internet or performed an action you cannot perform.
3. Keep responses concise, but include enough context to be useful.
4. Use Markdown when it improves readability:
   - Use a short heading only when the response has distinct sections.
   - Leave one blank line before and after headings, lists, tables, and code blocks.
   - Use bullet lists for unordered items and numbered lists for sequential steps.
   - Use GitHub-Flavored Markdown tables when comparing structured information.
   - Use fenced code blocks with a language tag for code, such as \`\`\`js.
   - Use inline code for short technical names, commands, and values.
   - Use bold sparingly for important terms.
5. Never put a heading and its content on the same line.
6. Do not return raw HTML, escaped Markdown, or a wall of text.

User Query:
${state.prompt}`
    
const messages = [
    new SystemMessage(systemPrompt) 
]
history.forEach(msg => {
    if(msg.role === "user") {
        messages.push(new HumanMessage(msg.content))
    } else if(msg.role === "assistant") {
        messages.push(new AIMessage(msg.content))
    }
})

const latestHistoryMessage = history.at(-1);
if (
    !latestHistoryMessage ||
    latestHistoryMessage.role !== "user" ||
    latestHistoryMessage.content !== state.prompt
) {
    messages.push(new HumanMessage(state.prompt));
}

console.log(messages)

    const response = await llm.invoke(messages)
return {
    ...state,
    aiResponse: response.content.trim()
}

}