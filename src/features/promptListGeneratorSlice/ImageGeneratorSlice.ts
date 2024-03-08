import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleCreditDecrement } from '../../utils/firebaseUtils';

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

const creditValue = Number(import.meta.env.VITE_IMAGE_GENERATOR_CREDITS);

export const generatorPrompt = createAsyncThunk('generator/generatorPrompt', async (prompt: string) => {
  await handleCreditDecrement(creditValue);
  try {
    const response = await axios.post(
      import.meta.env.VITE_OPEN_AI_GENERATION_API_URL,
      {
        model: "dall-e-3",
        prompt: prompt.prompt,
        n: 1,
        size: "1024x1024"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in generatorPrompt:', error.response?.data);
    throw error;
  }
});



const generatorSlice = createSlice({
  name: 'generator',
  initialState,
  reducers: {
    resetGeneratedData: (state) => {
      // Reset the state to its initial value
      state.data = null;
      state.error = null;
      state.status = 'idle';
    },
  },
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

export const { resetGeneratedData } = generatorSlice.actions; // Export the action creator
export default generatorSlice.reducer;