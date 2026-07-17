import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversationList, getMessages } from "../../apis/chat";
import type { RootState } from "../../app/store";

interface Conversation {
  _id: string;
  isGroup: boolean;
  groupName?: string;
  participants: { _id: string; name: string; email: string }[];
  lastMessage?: { content: string; createdAt: string };
}

interface ChatState {
  error: string | null | Object;
  success: boolean;
  loading: boolean;
  chatList: Conversation[];
  activeConversation: Conversation | null;
  messages:Record<string, any[]>;
}

const initialState: ChatState = {
  error: null,
  success: false,
  loading: false,
  chatList: [],
  activeConversation: null,
  messages:{}
};
interface GetMessagesPayload {
  conversationId: string;
  page: number;
  limit: number;
}

export const getChatList = createAsyncThunk(
  "chat/chatlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getConversationList();
      return response;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const GetMessage = createAsyncThunk("chat/MessagesList",async({conversationId,page,limit}:GetMessagesPayload,{rejectWithValue})=>{
try {
  const res = await getMessages(conversationId,page,limit);
  return res
} catch (error:any) {
  return rejectWithValue(error?.response?.data?.message)
}
})

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      
    },
    clearChatList: (state) => {
      state.error = null;
      state.loading = false;
      state.success = false;
      state.chatList = [];
      state.activeConversation = null;
    },
  addMessage(state, action) {
  const message = action.payload;

  const conversationId = message.conversation;

  if (!state.messages[conversationId]) {
    state.messages[conversationId] = [];
  }

  const exists = state.messages[conversationId].some(
    (m) => m._id === message._id
  );

  if (!exists) {
    state.messages[conversationId].push(message);
  }
}
  },
  extraReducers(builder) {
    builder
      .addCase(getChatList.pending, (state) => {
        state.success = false;
        state.error = null;
        state.loading = true;
      })
      .addCase(getChatList.fulfilled, (state, action) => {
        state.success = true;
        state.error = null;
        state.loading = false;
        state.chatList = action.payload.data;
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.success = false;
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(GetMessage.pending,(state)=>{
        state.success = false;
        state.error = null;
        state.loading = true;

      })
      .addCase(GetMessage.fulfilled,(state,action)=>{
        console.log("show action paylaod---->",action.payload);
        
        state.success = true;
        state.loading = false;
        state.error = null;
         const { conversationId } = action.meta.arg;
         state.messages[conversationId] = action.payload.data.messages;
      })
      .addCase(GetMessage.rejected,(state,action)=>{
        state.success = false;
        state.error = action.payload as any;
        state.loading= false
      })
  },
});

export const { clearChatList, addMessage,setActiveConversation } = chatSlice.actions;

export default chatSlice.reducer;

// selectors
export const getChatListState = (state: RootState) => state.chat.chatList;
export const getActiveConversation = (state: RootState) => state.chat.activeConversation;
export const getChatLoading = (state: RootState) => state.chat.loading;
export const Messages = (state:RootState)=> state.chat.messages