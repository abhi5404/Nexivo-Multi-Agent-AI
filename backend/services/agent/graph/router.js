

export const router = (params) => {
   const llm = getModels("router")
   const prompt = `You are a router agent. Your task is to determine
    the appropriate agent for a given user prompt. The available agents are: chat, search, 
    coding, and imageGen. Based on the user's prompt, you should return the name of the most 
    suitable agent. If the prompt is ambiguous or does not clearly indicate a specific agent, 
    default to returning "chat" 
    Rules: 
    1. If the user is asking a question that requires a general knowledge answer,current events,latest information, news, internet lookups, return "chat". 
    2. If the user is asking for information that can be found through a search, return "search". 
    3. If the user is asking for help with coding,generate code,debugging,building applications,architectural design,api design, return "coding". 
    4. If the user is asking for help with generating an image, return "imageGen", 
    5. If the user is asking for help with generating a PDF, document context, return "pdf", 
    6. If the user is asking for help with generating a PPT, return "ppt", 
    7. If the user is asking for help with any other task, return "chat". 
    Return only one word : chat, search, coding, imageGen, pdf, ppt.
User Query :
${state.prompt}`

await llm.invoke(prompt).then((response) => {
    state.agent = response.output_text.trim()
    console.log("Router Agent selected:", state.agent)
})