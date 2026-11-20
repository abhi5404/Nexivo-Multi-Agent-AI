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

   const prompt = String(state.prompt || "").toLowerCase();

   if (
      /\b(code|coding|develop|debug|javascript|java|python|react|html|css|function|class|api|program|application)\b/.test(prompt)
   ) {
      return {
         ...state,
         agent: "coding",
      };
   }
   if (/\b(image|picture|logo|illustration|draw|generate an image)\b/.test(prompt)) {
      return {
         ...state,
         agent: "imageGen",
      };
   }
   if (/\b(pdf|document)\b/.test(prompt)) {
      return {
         ...state,
         agent: "pdf",
      };
   }
   if (/\b(ppt|presentation|slides|powerpoint)\b/.test(prompt)) {
      return {
         ...state,
         agent: "ppt",
      };
   }
   if (/\b(search|find|latest|news|current|internet|lookup)\b/.test(prompt)) {
      return {
         ...state,
         agent: "search",
      };
   }

   return {
      ...state,
      agent: "chat",
   };
}