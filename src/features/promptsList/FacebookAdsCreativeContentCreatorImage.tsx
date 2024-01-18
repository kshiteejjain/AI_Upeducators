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


const FacebookAdsCreativeContentCreatorImage = () => {
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptMsg, setShowPromptMsg] = useState('');
  

  useEffect(() => {
    setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);
 

  const [formData, setFormData] = useState({
    service: '',
    audience: ''
  });


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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
      const promptMessage = `Generate compelling text for a single image ad promoting ${formData.service} to ${formData.audience}. Then craft an impactful caption that encapsulates the key benefit or unique selling point of [service/skill] (autofilled). Ensure the text is visually appealing and complements the image. Aim for clarity, captivation, and relevance to the audience's interests.      `

      setShowPromptMsg(promptMessage);
      dispatchThunk(generatorPrompt(promptMessage));
    } catch (error) {
      alert.error('Error fetching data:', error);
    }
  };

  return (
    <div className="generator-section">
      {isLoading ? <Loader /> : null}
      <h2>Facebook ads creative content creator (Image)</h2>
      <h3>Design striking single-image content for Facebook ads with engaging text to grab the attention of your audience.</h3>
      <form onSubmit={sendPrompt}>
        <div className='form-group'>
          <label htmlFor='service:'>Service/Skill <span className='asterisk'>*</span></label>
          <input name="service" required className='form-control' onChange={handleInputChange} value={formData.service} placeholder="Write your service/skill name and describe briefly" />
        </div>
        <div className='form-group'>
          <label htmlFor='audience:'>Audience <span className='asterisk'>*</span></label>
          <input name="audience" required className='form-control' onChange={handleInputChange} value={formData.audience} placeholder="Identify the target audience for your ad, such as Teenagers, College Students." />
        </div>

        <Button title='Generate' type="submit" />

        <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
      </form>
    </div>
  )
};

export default FacebookAdsCreativeContentCreatorImage;