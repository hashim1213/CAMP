import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from './firebase-config';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ senderId, recipientId, text, participants }, { rejectWithValue }) => {
    try {
      const response = await addDoc(collection(db, "messages"), {
        senderId,
        recipientId,
        text,
        createdAt: new Date(),
        participants: participants.sort(),
      });
      // Return something meaningful here if needed, such as the message ID
      return response.id;
    } catch (error) {
      return rejectWithValue('Unable to send message');
    }
  }
);

const initialState = {
  messages: [],
  status: 'idle', // 'idle' | 'loading' | 'listening' | 'succeeded' | 'failed'
  error: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
      state.status = 'succeeded';
    },
    updateMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle other async thunks like fetchMessages if they exist
      .addCase(sendMessage.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        // If you choose to update the state with the newly sent message
         state.messages.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setMessages, updateMessage, setStatus } = chatSlice.actions;

export default chatSlice.reducer;
