import React, { useState, ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
type ImageGeneratorData = {
  status: string;
};
type RootState = {
  target: { name: string; value: string; };
  generatorData: ImageGeneratorData;
  status: string;
  e: Event;
  onChange: () => void;
};

const ImageGenerator = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);

  const [formData, setFormData] = useState({
      topic: '',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
      }));
  };

  const promptMessage = `Generate an image on ${formData.topic}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    
  return (
    <div className="generator-section">

      <h2>AI Image Generator</h2>
      <h3>Experience the mesmerizing world of AI-generated images, where algorithms create stunning visuals that blur the line between reality and imagination.</h3>
      <form onSubmit={handleSubmit}>
        
        <div className='form-group'>
          <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
          <textarea name="topic" required className='form-control' rows={5} onChange={handleInputChange} value={formData.topic} placeholder="Enter Description"></textarea>
        </div>
       
        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default ImageGenerator;