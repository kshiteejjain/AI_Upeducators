// GeneratorSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface GeneratorState {
  data?: string | number | null; // Define the type based on your API response
  error?: string | null;
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: GeneratorState = {
  data: null,
  error: null,
  status: 'idle',
};


// Define the async thunk
export const generatorPrompt = createAsyncThunk('generator/generatorPrompt', async (prompt: string) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_OPEN_AI_API_URL}`, {
      model: 'gpt-3.5-turbo-instruct',
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    },
    {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`
        },
    });
console.log(response.data)
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error.message;
    } else {
      throw error;
    }
  }
});

const generatorSlice = createSlice({
  name: 'generator',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generatorPrompt.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generatorPrompt.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(generatorPrompt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message as string;
      });
  },
});

export default generatorSlice.reducer;
