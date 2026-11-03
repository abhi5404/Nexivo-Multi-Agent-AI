import { Annotation} from "@langchain/langgraph"

export const agentState = Annotation.Root({
    prompt: Annotation.String(),
    aiResponse : Annotation.String(),
    agent : Annotation.String(),
    conversationId : Annotation.String()
})