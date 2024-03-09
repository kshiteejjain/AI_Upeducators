import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleCreditDecrement } from '../../utils/firebaseUtils';
import { RootState } from 'react-redux';
import { addDoc, collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';

const creditValue = Number(import.meta.env.VITE_TEXT_GENERATOR_CREDITS);

export const generatorPrompt = createAsyncThunk('generator/generatorPrompt', async (props: { prompt: string; isGPT4: boolean }, { getState, rejectWithValue }) => {
  try {
    const { prompt, isGPT4 } = props;
    console.log('isGPT4->', isGPT4);

    const arrayPrompt = prompt.split(' ');

    const promptList = JSON.parse(localStorage.getItem('prompts') || '[]');
    promptList.push({
      role: 'user',
      content: arrayPrompt,
      isFollowUpPrompt: false
    });
    localStorage.setItem('prompts', JSON.stringify(promptList));

    await handleCreditDecrement(creditValue);

    const state = getState() as RootState;
    const selectedCategory = state.selectedCategory.selectedCategory;
    const firestore = getFirestore();

    const formListCollection = collection(firestore, 'FormsList');
    const formListQuery = query(formListCollection, where('redirect', '==', selectedCategory));
    const formListExistingDocs = await getDocs(formListQuery);

    if (!formListExistingDocs.empty) {
      formListExistingDocs.forEach(async (doc) => {
        const docRef = doc.ref;
        const currentCount = doc.data().usageCount || 0;
        await updateDoc(docRef, { usageCount: currentCount + 1, timeStamp: new Date().toLocaleString() });
      });
    } else {
      await addDoc(formListCollection, { selectedCategory, usageCount: 1 });
    }

    const RegisteredUsersCollection = collection(firestore, 'RegisteredUsers');
    const RegisteredUsersQuery = query(RegisteredUsersCollection, where('email', '==', localStorage.getItem('username')));
    const RegisteredUsersExistingDocs = await getDocs(RegisteredUsersQuery);
    
    if (!RegisteredUsersExistingDocs.empty) {
      RegisteredUsersExistingDocs.forEach(doc => {
          const isAdmin = doc.data().isAdmin;
          if (isAdmin === true) {
              alert(prompt);
          }
      });
  }


    const categoryStatsCollection = collection(firestore, 'CategoryStats');
    const categoryStatsQuery = query(categoryStatsCollection, where('selectedCategory', '==', selectedCategory));
    const categoryStatsExistingDocs = await getDocs(categoryStatsQuery);

    if (!categoryStatsExistingDocs.empty) {
      categoryStatsExistingDocs.forEach(async (doc) => {
          const docRef = doc.ref;
          const currentCount = doc.data().count || 0;
          await updateDoc(docRef, { count: currentCount + 1, timeStamp: new Date().toLocaleString(), user: localStorage.getItem('username') });
      });
  } else {
      const docRef = doc(categoryStatsCollection, selectedCategory);
      await setDoc(docRef, { selectedCategory, count: 1, timeStamp: new Date().toLocaleString(), user: localStorage.getItem('username') });
  }
  

  const response = await axios.post(
    `${import.meta.env.VITE_OPEN_AI_CHAT_COMPLETION_API_URL}`,
    {
      model: isGPT4 ? 'gpt-4': 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: arrayPrompt.join(' ') 
        }
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_AI_KEY}`,
      },
    }
  );
  
    console.log(`Using model: ${isGPT4 ? 'gpt-4-0125-preview': 'gpt-3.5-turbo'}`);
    return response?.data?.choices[0]?.message?.content?.trim();
  } catch (error) {
    console.error('Error sending message to OpenAI API:', error);
    return rejectWithValue(error.message || 'Failed to fetch data');
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
        state.messages.push(aiMessage);
      })
      .addCase(generatorPrompt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch data';
      });
  },
});

export const { resetGeneratedData, setMessages, addMessage, isFollowUpPrompt } = generatorSlice.actions;
export default generatorSlice.reducer;

