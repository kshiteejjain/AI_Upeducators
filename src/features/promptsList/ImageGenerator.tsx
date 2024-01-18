import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { useNavigate } from 'react-router-dom';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import Loader from '../../components/loader/Loader';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchTotalCredits } from '../../utils/firebaseUtils';

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
  const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
  const [isLoading, setIsLoading] = useState(false);
  const [showPromptMsg, setShowPromptMsg] = useState('');
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = sessionStorage.getItem('username') ?? 'User';
        // Fetch only setRemainingCredits
        await fetchTotalCredits(storedUsername, undefined, setRemainingCredits);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors as needed
      }
    };

    fetchData();

    if (remainingCredits !== undefined && remainingCredits < 5) {
      navigate('/ContactUs');
    }
  }, [remainingCredits, navigate]);

  useEffect(() => {
      setIsLoading(loadingStatus === 'loading');
  }, [loadingStatus]);


  const [formData, setFormData] = useState({
      audience: '',
      topic: '',
      tone: 'Informative',
      keywords: ''
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
          const promptMessage = `Generate images for the topic ${formData.topic}.`

          setShowPromptMsg(promptMessage);
          dispatchThunk(generatorPrompt(promptMessage));
      } catch (error) {
          alert.error('Error fetching data:', error);
      }
  };
  return (
    <div className="generator-section">
      {isLoading ? <Loader /> : null}
      <h2>AI Image Generator</h2>
      <h3>Experience the mesmerizing world of AI-generated images, where algorithms create stunning visuals that blur the line between reality and imagination.</h3>
      <form onSubmit={sendPrompt}>
        
        <div className='form-group'>
          <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
          <textarea name="topic" required className='form-control' rows={5} onChange={handleInputChange} value={formData.topic} placeholder="Enter Description"></textarea>
        </div>
       
        <Button title='Generate' type="submit" />

        <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
      </form>
    </div>
  )
};

export default ImageGenerator;