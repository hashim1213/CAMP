// src/teamSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from './firebase-config';
import { collection, getDocs } from 'firebase/firestore';

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async (_, { rejectWithValue }) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      return rejectWithValue('Failed to fetch team members');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    members: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.members = action.payload;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default teamSlice.reducer;
