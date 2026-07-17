import type { RootState } from "../app/store";

export const getConversationMessages = (
  state: RootState,
  conversationId: string,
  
) => {
  return state.chat.messages[conversationId] || [];
};