import { StateGraph } from "@langchain/langgraph"
import { agentState } from "./state.js"
import { router } from "./router.js"
import { chatAgent } from "../agents/chat.agent.js"
import { searchAgent } from "../agents/search.agent.js"
import { codingAgent } from "../agents/coding.agent.js"
import { imageAgent } from "../agents/imageGen.agent.js"
import { pdfAgent } from "../agents/pdf.agent.js"
import { pptAgent } from "../agents/ppt.agent.js"


// Create a new state graph with the agentState as the root state
const workflow = new StateGraph(agentState)

// Add nodes to the workflow

workflow.addNode("router",router)
workflow.addNode("chat",chatAgent)
workflow.addNode("search",searchAgent)
workflow.addNode("coding",codingAgent)
workflow.addNode("imageGen",imageAgent)
workflow.addNode("pdf",pdfAgent)
workflow.addNode("ppt",pptAgent)

// Add edges to the workflow

workflow.addEdge("__start__","router")
workflow.addConditionalEdges("router",(state) => {
    switch(state.agent){
        case "chat":
            return "chat"
        case "search":
            return "search"
        case "coding":
            return "coding"
        case "imageGen":
            return "imageGen"
        case "pdf":
            return "pdf"
        case "ppt":
            return "ppt"
        default:
            return "chat"
    }
},{ //for the default case, if no agent is specified, we will go to chat agent
    "chat": "chat",
    "search": "search",
    "coding": "coding",
    "imageGen": "imageGen",
    "pdf": "pdf",
    "ppt": "ppt"
})

// Add edges to the workflow for the end state

workflow.addEdge("search","chat")
workflow.addEdge("chat","__end__")
workflow.addEdge("coding","__end__")
workflow.addEdge("imageGen","__end__")
workflow.addEdge("pdf","__end__")
workflow.addEdge("ppt","__end__")

export const graph = workflow.compile()