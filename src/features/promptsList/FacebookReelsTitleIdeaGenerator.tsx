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


const FacebookReelsTitleIdeaGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        number: '',
        audience: '',
        interestArea: '',
        duration: 'seconds',
        purpose: 'educational'
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
            const promptMessage = `Generate ${formData.number} creative title ideas for Facebook Reels aimed at ${formData.audience} with an interest in ${formData.interestArea}. The title should suit a ${formData.duration} long reel and be [purpose] in nature, engaging the audience effectively.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Facebook Reels Title Idea Generator</h2>
            <h3>Generate creative and engaging title ideas for Facebook Reels, tailored to your specific audience and goals.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='number'>Number</label>
                    <input className='form-control' name='number' onChange={handleInputChange} value={formData.number} placeholder='Specify how many reel ideas you want to generate.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify the target audience, e.g., Young Adults, Parents, Fitness Enthusiasts, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='interestArea'>Interest Area</label>
                    <input required className='form-control' name='interestArea' onChange={handleInputChange} value={formData.interestArea} placeholder='Mention a broad area of interest related to your audience, like Technology, Health & Wellness, Education, Entertainment.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="seconds"> Seconds</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='purpose'> Purpose</label>
                    <select className='form-control' name="purpose" onChange={handleInputChange} value={formData.purpose}>
                        <option value="educational">Educational</option>
                        <option value="promotional">Promotional</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="inspirational">Inspirational</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default FacebookReelsTitleIdeaGenerator;