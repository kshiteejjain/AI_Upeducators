import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../questionGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import Loader from '../../components/loader/Loader';
import { AnyAction } from '@reduxjs/toolkit';

type GeneratorData = {
  status: string;
};

type RootState = {
  target: { name: string; value: string; };
  generatorData: GeneratorData;
  status: string;
  e: Event;
  onChange: () => void;
};


const SocialMediaMemeIdeasGenerator = () => {
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptMsg, setShowPromptMsg] = useState('');
  

  useEffect(() => {
    setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);
 

  const [formData, setFormData] = useState({
    audience: '',
    platform: 'Facebook',
    contentType: 'Single Image Post',
    memeTheme: '',
    numberOfIdeas: '5',
    tone: 'Humorous'
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

  const sendPrompt = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const promptMessage = `Generate ${formData.numberOfIdeas} meme ideas for ${formData.audience} on ${formData.platform} in a ${formData.contentType} format. The memes should ideally explore '${formData.memeTheme}' and maintain a ${formData.tone} tone, ensuring they are original, relatable, and shareable on social media.`

      setShowPromptMsg(promptMessage);
      dispatchThunk(generatorPrompt(promptMessage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="generator-section">
      {isLoading ? <Loader /> : null}
      <h2>Social Media Meme Ideas Generator</h2>
      <h3>Generate creative and engaging meme ideas that resonate with your target audience and are suitable for various social media platforms.</h3>
      <form onSubmit={sendPrompt}>
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

        <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
      </form>
    </div>
  )
};

export default SocialMediaMemeIdeasGenerator;