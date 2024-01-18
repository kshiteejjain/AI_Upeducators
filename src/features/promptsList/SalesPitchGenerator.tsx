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

const SalesPitchGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        service: '',
        audience: '',
        additionalDetails: '',
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
            const promptMessage = `Generate a sales pitch for ${formData.service} aimed at ${formData.audience}. Highlight the Key Features and the unique selling proposition (USP). Additional details to be included are ${formData.additionalDetails}. Emphasize how it achieves the Desired Outcome, convincing potential customers of its value.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Sales Pitch Generator</h2>
            <h3>Generate Effective Sales pitch for your Services to convert your Prospects.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='service'>Service/Skill <span className='asterisk'>*</span></label>
                    <input type='text' required className='form-control' name='service' onChange={handleInputChange} value={formData.service} placeholder='Write your service/skill name.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Target Audience<span className='asterisk'>*</span></label>
                    <input type='text' className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify the target audience for your product or service. For example, "High School Teachers" or "Parents of Middle School Students"' />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea className='form-control' name='additionalDetails' rows={5} onChange={handleInputChange} value={formData.additionalDetails} placeholder='List the highlights/key features/additional details of your product or service. For example, "Training by experts, Interactive tutorials, Customizable lesson plans"'></textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    );
};

export default SalesPitchGenerator;
