import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
    name: "conversation",
    initialState: {
        conversations: [],
        selectedConversation: null,
    },
    reducers: {
        setConversations: (state, action) => {
            state.conversations = action.payload;
        },
        addConversation: (state, action) => {
            state.conversations.unshift(action.payload);
        },
        selectConversation: (state, action) => {
            state.selectedConversation = action.payload;
        },
    },
}); 

export const { setConversations, addConversation, selectConversation } = conversationSlice.actions;
export default conversationSlice.reducer;