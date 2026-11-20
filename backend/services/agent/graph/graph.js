import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { chatAgent } from "../agents/chat.agent.js";
import { codingAgent } from "../agents/coding.agent.js";
import { imageGenAgent } from "../agents/imageGen.agent.js";
import { pdfAgent } from "../agents/pdf.agent.js";
import { pptAgent } from "../agents/ppt.agent.js";
import { searchAgent } from "../agents/serach.agent.js";
import { router } from "./router.js";

const workflow = new StateGraph(agentState);

workflow.addNode("chat", chatAgent);
workflow.addNode("coding", codingAgent);
workflow.addNode("imageGen", imageGenAgent);
workflow.addNode("pdf", pdfAgent);
workflow.addNode("ppt", pptAgent);
workflow.addNode("search", searchAgent);
workflow.addNode("route", router);

workflow.addEdge("__start__", "route");
workflow.addConditionalEdges("route", (state) => {
    const agent = state.agent;
    return ["chat", "coding", "imageGen", "pdf", "ppt", "search"].includes(agent)
        ? agent
        : "chat";
});
workflow.addEdge("chat", "__end__");
workflow.addEdge("coding", "__end__");
workflow.addEdge("imageGen", "__end__");
workflow.addEdge("pdf", "__end__");
workflow.addEdge("ppt", "__end__");
workflow.addEdge("search", "__end__");

export const graph = workflow.compile();
