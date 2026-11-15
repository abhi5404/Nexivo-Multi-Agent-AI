import { StateGraph } from "@langchain/langgraph";
import { agentState } from "./state.js";
import { chatAgent } from "../agents/chat.agent.js";

const workflow = new StateGraph(agentState);

workflow.addNode("chat", chatAgent);
workflow.addEdge("__start__", "chat");
workflow.addEdge("chat", "__end__");

export const graph = workflow.compile();
