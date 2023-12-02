import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
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


const SocialMediaPostContentGenerator = () => {
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptMsg, setShowPromptMsg] = useState('');
  

  useEffect(() => {
    setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);
 

  const [formData, setFormData] = useState({
    audience: '',
    platform: 'Facebook',
    postIdea: '',
    contentFormat: '5',
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
      const promptMessage = `Develop a social media post for ${formData.audience} on ${formData.platform}. The post should be based on ${formData.postIdea} and created in the ${formData.contentFormat} style. Ensure that the content is captivating, relevant, and effectively communicates with the target audience. Also mention what is caption and what should be written over the post.`
      setShowPromptMsg(promptMessage);
      dispatchThunk(generatorPrompt(promptMessage));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="generator-section">
      {isLoading ? <Loader /> : null}
      <h2>Social Media Post Content Generator</h2>
      <h3>Craft detailed social media posts based on your conceptual ideas, specifically designed for your target audience and chosen platform.</h3>
      <form onSubmit={sendPrompt}>
        <div className='form-group'>
            <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
            <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify your target audience, for example, College Students, Young Parents, Tech Enthusiasts' />
        </div>
        <div className='form-group'>
          <label htmlFor='platform'>Platform <span className='asterisk'>*</span> </label>
          <select required className='form-control' name="platform" onChange={handleInputChange} value={formData.platform}>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="Twitter">Twitter</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="TikTok">TikTok</option>
            <option value="Pinterest">Pinterest</option>
            <option value="YouTube">YouTube</option>
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='postIdea'>Post Idea <span className='asterisk'>*</span></label>
          <textarea name="postIdea" required className='form-control' rows={5} onChange={handleInputChange} value={formData.postIdea} placeholder="Briefly outline your post idea or concept, such as an announcement, a motivational quote, or a user engagement question"></textarea>
        </div>
        <div className='form-group'>
          <label htmlFor='contentFormat'>Content Format <span className='asterisk'>*</span></label>
          <select required className='form-control' name="contentFormat" onChange={handleInputChange} value={formData.contentFormat}>
            <option value="SingleImage">Single Image</option>
            <option value="Carousel">Carousel</option>
            <option value="Video">Video</option>
            <option value="Text">Text</option>
            <option value="Story">Story</option>
            <option value="Reel">Reel</option>
            <option value="Poll">Poll</option>
            <option value="Infographic">Infographic</option>
          </select>
        </div>

        <Button title='Generate' type="submit" />

        <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
      </form>
    </div>
  )
};

export default SocialMediaPostContentGenerator;