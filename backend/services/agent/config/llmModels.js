import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter";

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})

const openrouter = new ChatOpenRouter({
  model: "deepseek/deepseek-chat",
  temperature: 0,
  maxTokens : 2500
});



const google = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    temperature: 0,
    maxRetries: 2,
    // other params...
})

export const getModels = async (agent) => {
    switch (agent) {
        case "chat":
            return groq
        case "deepseek":
            return openrouter
        case "search":
            return google
        case "coding":
            return groq
        case "imageGen":
            return groq
        case "pdf":
            return google
        case "ppt":
            return google
            default:
            return groq
    }
}