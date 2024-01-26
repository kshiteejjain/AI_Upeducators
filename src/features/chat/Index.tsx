// src/components/Chat.js
import { useState } from 'react';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (input.trim() === '') {
      return; // Skip sending empty messages
    }
  
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
  
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: newMessages.map((msg) => ({ role: msg.role, content: msg.content })),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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',
          },
        }
      );
  
      const aiMessage = { role: 'assistant', content: response.data.choices[0].message.content.trim() };
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message to OpenAI API:', error);
    }
  };
  

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
