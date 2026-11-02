import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"

const groq = new ChatGroq({
    model: "openai/gpt-oss-120b",
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    // other params...
})

const google = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-pro",
    temperature: 0,
    maxRetries: 2,
    // other params...
})

export const getModels = async () => {
    switch (agent) {
        case "chat":
            return groq
        case "search":
            return google
        case "coding":
            return google
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