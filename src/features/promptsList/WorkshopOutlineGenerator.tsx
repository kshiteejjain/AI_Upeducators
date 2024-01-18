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

const WorkshopOutlineGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        workshopTitle: '',
        targetAudience: '',
        workshopDuration: '',
        mainTopics: '',
        workshopGoals: '',
        specialInstructions: '',
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
            const promptMessage = `Create a workshop outline for "${formData.workshopTitle}" targeted at ${formData.targetAudience}. The workshop will last for ${formData.workshopDuration}. Key topics include: ${formData.mainTopics}. The goals of the workshop are ${formData.workshopGoals}. Special instructions: ${formData.specialInstructions}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Workshop Outline Generator</h2>
            <h3>This tool helps in designing detailed outlines for various types of workshops.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='workshopTitle'> Workshop Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='workshopTitle' onChange={handleInputChange} value={formData.workshopTitle} placeholder='Enter the title of the workshop.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'> Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify who the workshop is intended for.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='workshopDuration'> Workshop Duration <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='workshopDuration' onChange={handleInputChange} value={formData.workshopDuration} placeholder='Mention the total duration of the workshop (e.g., 2 hours, 3 days).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='mainTopics'> Main Topics </label>
                    <textarea className='form-control' name='mainTopics' onChange={handleInputChange} rows={5} value={formData.mainTopics} placeholder='List the main topics that will be covered in the workshop.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='workshopGoals'> Workshop Goals </label>
                    <textarea className='form-control' name='workshopGoals' onChange={handleInputChange} rows={5} value={formData.workshopGoals} placeholder='Describe the key objectives and goals of the workshop.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='specialInstructions'> Special Instructions </label>
                    <textarea className='form-control' name='specialInstructions' onChange={handleInputChange} rows={5} value={formData.specialInstructions} placeholder='Include any special instructions or prerequisites for attendees.'> </textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default WorkshopOutlineGenerator;
