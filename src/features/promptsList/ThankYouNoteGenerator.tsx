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

const ThankYouNoteGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        recipientName: '',
        relationship: '',
        occasion: '',
        details: '',
        length: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            const promptMessage = `Generate a Thank You Note addressed to ${formData.recipientName} who is ${formData.relationship}. The note should express gratitude for ${formData.occasion}, ${formData.details ? `${formData.details} if applicable.` : ''} The note should be within ${formData.length}`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Thank You Note Generator</h2>
            <h3>Create a personalized Thank You Note for various occasions.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='recipientName'> Recipient's Name </label>
                    <input className='form-control' name='recipientName' onChange={handleInputChange} value={formData.recipientName} placeholder='Enter the full name of the person you are thanking.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='relationship'> Your Relationship with the Recipient </label>
                    <input className='form-control' name='relationship' onChange={handleInputChange} value={formData.relationship} placeholder='Briefly describe your relationship with the recipient (e.g., friend, colleague, family member).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='occasion'> Occasion/Reason for Thanks </label>
                    <input required className='form-control' name='occasion' onChange={handleInputChange} value={formData.occasion} placeholder='Describe the occasion or reason for expressing thanks.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='details'> Specific Details about the Gift/Help/Support </label>
                    <textarea className='form-control' name='details' onChange={handleInputChange} rows={5} value={formData.details} placeholder='Mention specific details about the gift, help, or support you received.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='length'> Length of the Note </label>
                    <input className='form-control' name='length' onChange={handleInputChange} value={formData.length} placeholder='Specify the desired length of the Thank You Note (e.g., 50 words, 100 words).' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    );
};

export default ThankYouNoteGenerator;
