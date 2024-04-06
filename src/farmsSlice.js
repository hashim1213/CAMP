import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase-config'; // Adjust the import path as necessary

// Async thunk to fetch farms from Firestore
export const fetchFarms = createAsyncThunk('farms/fetchFarms', async (userId) => {
  const createdFarmsRef = query(collection(db, "farms"), where("createdBy", "==", userId));
  const sharedFarmsRef = query(collection(db, "farms"), where("sharedWith", "array-contains", userId));

  const [createdFarmsSnap, sharedFarmsSnap] = await Promise.all([
    getDocs(createdFarmsRef),
    getDocs(sharedFarmsRef),
  ]);

  // Process and return the fetched farms data
  const farmsData = [...createdFarmsSnap.docs, ...sharedFarmsSnap.docs].map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  return farmsData;
});

const farmsSlice = createSlice({
  name: 'farms',
  initialState: {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFarms.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchFarms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFarms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default farmsSlice.reducer;
