export const router = async (state) => {
   const selectedAgent = String(state.agent || "auto").toLowerCase();
   const mappedAgent = {
      chat: "chat",
      coding: "coding",
      image: "imageGen",
      imagegen: "imageGen",
      pdf: "pdf",
      ppt: "ppt",
      search: "search",
   }[selectedAgent];

   if (mappedAgent) {
      return {
         ...state,
         agent: mappedAgent,
      };
   }
return{
    ...state,
    agent:"chat"
}
}