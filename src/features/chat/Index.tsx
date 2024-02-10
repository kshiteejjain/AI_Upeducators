// src/components/Chat.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setMessages,
  setInput,
  generatorPrompt,
} from './chatSlice';
import './Index.css';
const Chat = () => {
  const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();
  const { generatorData: { messages, input, status, error } } = useSelector((state) => state);
  const [formData, setFormData] = useState({ input: '' });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the state when the input changes
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log('Messages:', messages);

  const sendPrompt = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input?.trim() === '') {
      return; // Skip sending empty messages
    }
    const prompt = [...messages, { role: 'user', content: formData.input }];
    dispatchThunk(setMessages(prompt));
    try {
      await dispatchThunk(generatorPrompt(prompt));
    } catch (error) {
      console.error('Error dispatching generatorPrompt:', error);
    }
  };
  return (
    <div className="msgWrapper">
      <div>
        {messages?.map((msg, index) => (
          <div key={index} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={sendPrompt} className="userInput">
      <input
          type="text"
          name="input"
          value={formData.input}
          onChange={handleChange}
          placeholder="Type your message..."
        />
        <button type='submit'>Send</button>
      </form>
      {status === 'failed' && <div>Error: {error}</div>}
    </div>
  );
};
export default Chat;
