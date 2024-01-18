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

const TextProofreaderPromptGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        originalText: '',
        toneRequirement: 'Formal',
        specialInstructions: '',
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
            const promptMessage = `Proofread and correct the provided text while maintaining its original meaning. The desired tone is ${formData.toneRequirement}. Apply any special instructions as ${formData.specialInstructions}`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Text Proofreader Prompt Generator</h2>
            <h3>Generate prompts to proofread and correct texts in various contexts, ensuring grammatical accuracy, appropriate tone, and clarity.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='originalText'> Original Text <span className='asterisk'>*</span> </label>
                    <textarea required className='form-control' name='originalText' onChange={handleInputChange} rows={5} value={formData.originalText} placeholder='Enter the original text that needs proofreading.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='toneRequirement'> Tone Requirement </label>
                    <select className='form-control' name="toneRequirement" onChange={handleInputChange} value={formData.toneRequirement}>
                        <option value="Formal">Formal</option>
                        <option value="Informal">Informal</option>
                        <option value="Persuasive">Persuasive</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Neutral">Neutral</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='specialInstructions'> Special Instructions </label>
                    <textarea className='form-control' name='specialInstructions' onChange={handleInputChange} rows={5} value={formData.specialInstructions} placeholder='Add any special instructions or areas of focus for the proofreading.'> </textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default TextProofreaderPromptGenerator;
