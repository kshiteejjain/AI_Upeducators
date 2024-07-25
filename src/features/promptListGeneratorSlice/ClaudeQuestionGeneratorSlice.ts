import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleCreditDecrement } from '../../utils/firebaseUtils';
import { RootState } from 'react-redux';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

const creditValue = Number(import.meta.env.VITE_TEXT_GENERATOR_CREDITS);
// Define the async thunk
export const generatorPrompt = createAsyncThunk('generator/generatorPrompt', async (prompt, { getState }) => {

  const promptList = JSON.parse(localStorage.getItem('prompts') || '[]'); // Get existing prompts or initialize as empty array
  promptList.push({
    role: 'user',
    content: prompt,
    isFollowUpPrompt: false
  });
  localStorage.setItem('prompts', JSON.stringify(promptList));
 
  await handleCreditDecrement(creditValue);
  try {
    const state = getState() as RootState; // Cast to RootState
    const selectedCategory = state.selectedCategory.selectedCategory;

    const firestore = getFirestore();
    const abcCollection = collection(firestore, 'CategoryStats');
    const user = localStorage.getItem('username'); // Assuming username is the user's email
    const catId = JSON.parse(localStorage.getItem('upEdu_prefix') ?? '{}')?.catId;

    if (user) {
      const userDocRef = doc(abcCollection, user);
      const userDocSnapshot = await getDoc(userDocRef);
    
      if (userDocSnapshot.exists()) {
        // User already has a document, update count
        const userData = userDocSnapshot.data();
        const existingCategory = userData[catId];
    
        if (existingCategory) {
          // catId already exists for the user, increase count
          const currentCount = existingCategory.count || 0;
          await updateDoc(userDocRef, {
            [catId]: {
              name: selectedCategory,
              count: currentCount + 1,
              creditsUsed: currentCount + 1,
              timestamp: new Date().toLocaleString()
            }
          });
        } else {
          // Add new catId entry for the user
          await updateDoc(userDocRef, {
            [catId]: {
              name: selectedCategory,
              count: 1,
              creditsUsed: 1,
              timestamp: new Date().toLocaleString()
            }
          });
        }
      } else {
        // Add new document for the user
        await setDoc(userDocRef, {
          [catId]: {
            name: selectedCategory,
            count: 1,
            timestamp: new Date().toLocaleString()
          }
        });
      }
    } else {
      console.error("User is not logged in."); // Handle not logged in scenario
    }
    
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 1024,
          messages: [
            { "role": "user", "content": "one word" }
          ]
        },
        {
          headers: {
            'x-api-key': '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',
            'anthropic-version': '2023-06-01',
            'content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://localhost:3000'
          },
        }
      );
      console.log('Model used:', response.data.model);
      return response?.data?.choices[0]?.message?.content?.trim();
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      throw error;
    }
    

  } catch (error) {
    alert(`Error sending message to OpenAI API:', ${error}`);
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
      state.messages = [];
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
        localStorage.removeItem('isGPT4');
      })
      .addCase(generatorPrompt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});
export const { resetGeneratedData, setMessages, addMessage, isFollowUpPrompt } = generatorSlice.actions; // Export the action creator
export default generatorSlice.reducer;