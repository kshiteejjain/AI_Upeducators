import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const MemeIdeas = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();
  const getInitialFormData = () => ({
    audience: '',
    memeContext: '',
  });
  const [formData, setFormData] = useState(getInitialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `Generate 5 meme ideas for ${formData.audience} on Facebook in a Single Image format. The memes should ideally explore '${formData.memeContext}', ensuring they are original, relatable, and shareable on social media.`
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    
  };
  return (
    <div className="generator-section">

      <h2>Meme Ideas</h2>
      <h3>Generate meme ideas that resonate with your target audience.</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="audience">Audience<span className="asterisk">*</span></label>
          <input
            required
            type="text"
            className="form-control"
            name="audience"
            onChange={handleInputChange}
            value={formData.audience}
            placeholder="Eg. students, parents"
          />
        </div>

        <div className="form-group">
          <label htmlFor="memeContext">Meme Context</label>
          <input
            type="text"
            className="form-control"
            name="memeContext"
            onChange={handleInputChange}
            value={formData.memeContext}
            placeholder="Eg. Yoga classes, Maths classes, School etc."
          />
        </div>

        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default MemeIdeas;