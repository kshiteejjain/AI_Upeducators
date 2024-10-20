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


const EmailTitleGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        audience: '',
        topic: '',
        tone: 'Formal',
        urgency: 'Include',
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
            const promptMessage = `Generate an engaging email title for ${formData.audience} about ${formData.topic}. The title should have a ${formData.tone} tone and ${formData.urgency} a sense of urgency, aiming to capture attention and encourage email opening.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Email Title Generator</h2>
            <h3>Generate captivating and effective email titles suitable for various topics and audiences.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Enter the target audience, e.g., Teachers, Students, Parents, Business Professionals.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder=' Specify the email"s main topic or subject, like "Online Learning Tools" or "Educational Discounts".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='tone'>Tone <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="tone" onChange={handleInputChange} value={formData.tone}>
                        <option value="Formal">Formal</option>
                        <option value="Informal">Informal</option>
                        <option value="Promotional">Promotional</option>
                        <option value="Informative">Informative</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='urgency'> Urgency <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="urgency" onChange={handleInputChange} value={formData.urgency}>
                        <option value="Include">Include </option>
                        <option value="Exclude">Exclude </option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default EmailTitleGenerator;