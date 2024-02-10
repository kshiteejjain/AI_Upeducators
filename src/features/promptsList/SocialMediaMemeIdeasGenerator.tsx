import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SocialMediaMemeIdeasGenerator = () => {
  const { generatorData: { messages, input } } = useSelector((state) => state);
  const dispatch = useDispatch();
  const getInitialFormData = () => ({
    audience: '',
    platform: 'Facebook',
    contentType: 'Single Image Post',
    memeTheme: '',
    numberOfIdeas: '5',
    tone: 'Humorous'
  });
  const [formData, setFormData] = useState(getInitialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const promptMessage = `Generate ${formData.numberOfIdeas} meme ideas for ${formData.audience} on ${formData.platform} in a ${formData.contentType} format. The memes should ideally explore '${formData.memeTheme}' and maintain a ${formData.tone} tone, ensuring they are original, relatable, and shareable on social media.`
  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    setFormData(getInitialFormData);
  };
  return (
    <div className="generator-section">

      <h2>Social Media Meme Ideas Generator</h2>
      <h3>Generate creative and engaging meme ideas that resonate with your target audience and are suitable for various social media platforms.</h3>
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
          <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify your target audience, e.g., College Students, Fitness Enthusiasts, Gaming Fans' />
        </div>
        <div className='form-group'>
          <label htmlFor='platform'>Platform <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="platform" onChange={handleInputChange} value={formData.platform}>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='memeTheme'>Meme Theme <span className='asterisk'>*</span></label>
          <textarea name="memeTheme" required className='form-control' rows={5} onChange={handleInputChange} value={formData.memeTheme} placeholder="Describe the theme or topic for the meme, like Workplace Humor, Tech Jokes, or Daily Life. Leave blank for broader themes."></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='numberOfIdeas'>Number of Ideas <span className='asterisk'>*</span></label>
          <select required className='form-control' name="numberOfIdeas" onChange={handleInputChange} value={formData.numberOfIdeas}>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='contentType'> Content Type <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="contentType" onChange={handleInputChange} value={formData.contentType}>
            <option value="SingleImage">Single Image</option>
            <option value="Video">Video</option>
            <option value="GIF">GIF</option>
            <option value="TextBased">Text-based</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='tone'> Tone <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="tone" onChange={handleInputChange} value={formData.tone}>
            <option value="Humorous">Humorous</option>
            <option value="Sarcastic">Sarcastic</option>
            <option value="Inspirational">Inspirational</option>
            <option value="Educational">Educational</option>
            <option value="Satirical">Satirical</option>
          </select>
        </div>
        <Button title='Generate' type="submit" />

      </form>
    </div>
  )
};
export default SocialMediaMemeIdeasGenerator;