import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleCreditDecrement } from '../../utils/firebaseUtils';
import { RootState } from 'react-redux';
import { addDoc, collection, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore';

interface GeneratorState {
  responses: string[];
  data?: string | number | null; // Define the type based on your API response
  error?: string | null;
  status?: 'idle' | 'loading' | 'succeeded' | 'failed';
}
const initialState: GeneratorState = {
  responses: [],
  data: null,
  error: null,
  status: 'idle',
};
const creditValue = Number(import.meta.env.VITE_TEXT_GENERATOR_CREDITS);
// Define the async thunk
export const generatorPrompt = createAsyncThunk('generator/generatorPrompt', async (prompt: string, { getState }) => {
  
  const promptList = JSON.parse(localStorage.getItem('prompts') || '[]'); // Get existing prompts or initialize as empty array
  promptList.push({
    role: 'user',
    content: prompt,
    isFollowUpPrompt : false
  });
  localStorage.setItem('prompts', JSON.stringify(promptList));
  
  
  await handleCreditDecrement(creditValue);
  try {
    const state = getState() as RootState; // Cast to RootState
      const selectedCategory = state.selectedCategory.selectedCategory;
    const firestore = getFirestore();
    const abcCollection = collection(firestore, 'CategoryStats');
    const q = query(abcCollection, where('selectedCategory', '==', selectedCategory));
    const existingDocs = await getDocs(q);
    if (!existingDocs.empty) {
      existingDocs.forEach(async (doc) => {
        const docRef = doc.ref;
        const currentCount = doc.data().count || 0;
        // Update count field
        await updateDoc(docRef, { count: currentCount + 1 });
      });
    } else {
      await addDoc(abcCollection, { selectedCategory, count: 1 });
    }
      const response = await axios.post(
        `${import.meta.env.VITE_OPEN_AI_CHAT_COMPLETION_API_URL}`,
        {
          model: 'gpt-3.5-turbo',
          messages: prompt.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
          },
        }
      );
      return response?.data?.choices[0]?.message?.content?.trim();
  } catch (error) {
    alert('Error sending message to OpenAI API:', error);
    throw error;
  }
});

const generatorSlice = createSlice({
  name: 'generator',
  initialState: {
    messages: [],
    isFollowUpPrompt: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    isFollowUpPrompt: (state, action) => {
      state.isFollowUpPrompt = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    resetGeneratedData: (state) => {
      state.messages = null;
      state.error = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generatorPrompt.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(generatorPrompt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const aiMessage = { role: 'assistant', content: action.payload };
        state.messages?.push(aiMessage);
      })
      .addCase(generatorPrompt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export const { resetGeneratedData, setMessages, addMessage, isFollowUpPrompt  } = generatorSlice.actions; // Export the action creator
export default generatorSlice.reducer;
