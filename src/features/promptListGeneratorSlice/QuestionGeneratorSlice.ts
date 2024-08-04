import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleCreditDecrement } from '../../utils/firebaseUtils';
import { RootState } from 'react-redux';
import { collection, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

const creditValue = Number(import.meta.env.VITE_TEXT_GENERATOR_CREDITS);
// Define the async thunk
export const generatorPrompt = createAsyncThunk('generator/generatorPrompt', async (prompt, { getState }) => {
  const isGPT4 = localStorage.getItem('isGPT4');
const isMini4 = localStorage.getItem('isMini4');

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
        `${import.meta.env.VITE_OPEN_AI_CHAT_COMPLETION_API_URL}`,
        {
          model: `${isGPT4 === 'true' ? 'gpt-4-0125-preview' : (isMini4 === 'true' ? 'gpt-4o-mini' : 'gpt-3.5-turbo')}`,
          messages: prompt.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
          },
        }
      );
      console.log('Model used ', response.data.model);
      localStorage.removeItem('isMini4');
      return response?.data?.choices[0]?.message?.content?.trim();
    } catch (error) {
      alert(`Error sending message to OpenAI API:', ${error}`);
      throw error;
    }
    

    const response = await axios.post(
      `${import.meta.env.VITE_OPEN_AI_CHAT_COMPLETION_API_URL}`,
      {
        model: `${isGPT4 === 'true' ? 'gpt-4-0125-preview' : 'gpt-3.5-turbo'}`,
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
    console.log('Model used ', response.data.model);
    return response?.data?.choices[0]?.message?.content?.trim();
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