import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getConversationList, getMessages } from "../../apis/chat";
import type { RootState } from "../../app/store";

interface Conversation {
  _id: string;
  isGroup: boolean;
  type?: string;
  groupName?: string;
  participants: { _id: string; name: string; email: string }[];
  lastMessage?: { content: string; createdAt: string };
  unreadCount?: number;
}

interface ChatState {
  error: string | null | Object;
  success: boolean;
  loading: boolean;
  chatList: Conversation[];
  activeConversation: Conversation | null;
  messages:Record<string, any[]>;
  unreadCounts: Record<string, number>;
}

const initialState: ChatState = {
  error: null,
  success: false,
  loading: false,
  chatList: [],
  activeConversation: null,
  messages:{},
  unreadCounts: {},
};
interface GetMessagesPayload {
  conversationId: string;
  page: number;
  limit: number;
}

export const getChatList = createAsyncThunk(
  "chat/chatlist",
  async (chatType:string, { rejectWithValue }) => {
    try {
      const response = await getConversationList(chatType);
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
      const id = action.payload?._id;
      if (id) {
        state.unreadCounts[String(id)] = 0;
      }
    },
    clearChatList: (state) => {
      state.error = null;
      state.loading = false;
      state.success = false;
      state.chatList = [];
      state.activeConversation = null;
      state.unreadCounts = {};
    },
    clearUnread: (state, action: { payload: string }) => {
      state.unreadCounts[action.payload] = 0;
    },
    addConversationToList: (state, action) => {
      const conv = action.payload;
      const id = String(conv._id);
      if (state.chatList.some((c) => String(c._id) === id)) {
        return;
      }
      state.chatList.unshift(conv);
    },
    bumpConversation: (
      state,
      action: {
        payload: {
          conversationId: string;
          preview: string;
          addUnread: boolean;
        };
      }
    ) => {
      const { conversationId, preview, addUnread } = action.payload;
      const id = String(conversationId);
      const index = state.chatList.findIndex((c) => String(c._id) === id);

      if (index >= 0) {
        const item = state.chatList[index];
        item.lastMessage = {
          content: preview,
          createdAt: new Date().toISOString(),
        };
        state.chatList.splice(index, 1);
        state.chatList.unshift(item);
      }

      if (addUnread) {
        state.unreadCounts[id] = (state.unreadCounts[id] ?? 0) + 1;
      }
    },
  addMessage(state, action) {
  const message = action.payload;
  const raw = message.conversation;
  const conversationId =
    raw != null && typeof raw === "object" && "_id" in raw
      ? String((raw as { _id: unknown })._id)
      : String(raw);

  if (!state.messages[conversationId]) {
    state.messages[conversationId] = [];
  }

  const exists = state.messages[conversationId].some(
    (m) => m._id === message._id
  );

  if (!exists) {
    state.messages[conversationId].push({
      ...message,
      conversation: conversationId,
    });
  }
},
 updateMessageStatus(state, action) {
  const { conversationId, messageId, status } = action.payload;

  const messages = state.messages[conversationId];

  if (!messages) return;

  const message = messages.find(
    (msg: any) => String(msg._id) === String(messageId)
  );

  if (message) {
    message.status = status;
  }
}
,updateConversationSeen(state, action) {
    const { conversationId } = action.payload;

    const messages = state.messages[conversationId];

    if (!messages) return;

    messages.forEach((msg: any) => {
      
      if (msg.status !== "seen") {
        msg.status = "seen";
      }

     
    });

    if (conversationId) {
      state.unreadCounts[String(conversationId)] = 0;
    }
  },
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
        for (const conv of action.payload.data) {
          const id = String(conv._id);
          if (typeof conv.unreadCount === "number") {
            state.unreadCounts[id] = conv.unreadCount;
          }
        }
      })
      .addCase(getChatList.rejected, (state, action) => {
        state.success = false;
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(GetMessage.fulfilled,(state,action)=>{
         const { conversationId } = action.meta.arg;
         state.messages[conversationId] = action.payload.data.messages;
      })
  },
});

export const {
  clearChatList,
  updateConversationSeen,
  updateMessageStatus,
  addMessage,
  setActiveConversation,
  clearUnread,
  addConversationToList,
  bumpConversation,
} = chatSlice.actions;

export default chatSlice.reducer;

// selectors
export const getChatListState = (state: RootState) => state.chat.chatList;
export const getActiveConversation = (state: RootState) => state.chat.activeConversation;
export const getChatLoading = (state: RootState) => state.chat.loading;
export const Messages = (state:RootState)=> state.chat.messages;
export const getUnreadCounts = (state: RootState) => state.chat.unreadCounts;