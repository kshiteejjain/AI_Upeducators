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


const FacebookVideoAdsScript = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        service: '',
        audience: '',
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
            const promptMessage = `For a Facebook ad in reel or video format, kickstart with an attention-grabbing intro for ${formData.service} to ${formData.audience}. Craft a compelling opening that sets the tone. Create engaging segments within the video that showcase various facets or benefits of [service/skill]. Ensure each segment tells a concise story, resonates with the audience's interests, and ends with a clear call-to-action.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Facebook Video Ads Script</h2>
            <h3>Create dynamic and visually appealing content for Facebook video.reel ad, tailored to captivate your audience and drive interaction.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='service'>Service/Skill <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='service' onChange={handleInputChange} value={formData.service} placeholder='Write your service/skill name and describe briefly' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required name="audience" className='form-control' onChange={handleInputChange} value={formData.audience} placeholder='Identify the target audience for your ad, such as Teenagers, College Students.' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default FacebookVideoAdsScript;