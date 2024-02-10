// src/slices/chatSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
export const generatorPrompt = createAsyncThunk(
  'generator/generatorPrompt',
  async (prompt) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
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
              'Bearer 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',
          },
        }
      );
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error sending message to OpenAI API:', error);
      throw error;
    }
  }
);
const chatSlice = createSlice({
  name: 'generator',
  initialState: {
    messages: [],
    input: '',
    status: 'idle',
    error: null,
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setInput: (state, action) => {
      state.input = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
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
        state.error = action.error.message;
      });
  },
});
export const { setMessages, setInput, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
