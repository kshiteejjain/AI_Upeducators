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


const WebinarOutlineGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        webinarTitle: '',
        audience: '',
        duration: 'Seconds',
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
            const promptMessage = `Generate a focused outline for a webinar titled "${formData.webinarTitle}" targeting ${formData.audience}. The webinar will be ${formData.duration} long.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Webinar Outline Generator</h2>
            <h3>Generate a structured outline for your webinar, focusing on the title and audience</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='webinarTitle'>Webinar Title <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='webinarTitle' onChange={handleInputChange} value={formData.webinarTitle} placeholder='Enter the title of your webinar (e.g., "Careers after 12th")' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify your target audience, e.g., College Students, Fitness Enthusiasts, Gaming Fans.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="seconds"> Seconds</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>


                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default WebinarOutlineGenerator;