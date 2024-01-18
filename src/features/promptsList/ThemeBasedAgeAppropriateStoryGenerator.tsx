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


const ThemeBasedAgeAppropriateStoryGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        ageGroup: 'Toddlers (0-3 years)',
        theme: '',
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
            const promptMessage = `Generate a ${formData.theme} themed story suitable for ${formData.ageGroup}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>ThemeBased Age Appropriate Story Generator</h2>
            <h3>This form is designed for creating stories tailored to specific age groups and themes, ensuring the content is both suitable and engaging for the intended audience.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='ageGroup'> Age Group <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="ageGroup" onChange={handleInputChange} value={formData.ageGroup}>
                        <option value="Toddlers (0-3 years)">Toddlers (0-3 years)</option>
                        <option value="Preschool (4-5 years)">Preschool (4-5 years)</option>
                        <option value="Early Elementary (6-8 years)">Early Elementary (6-8 years)</option>
                        <option value="Late Elementary (9-11 years)">Late Elementary (9-11 years)</option>
                        <option value="Middle School (12-14 years)">Middle School (12-14 years)</option>
                        <option value="High School (15-18 years)">High School (15-18 years)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='theme'>Theme <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='theme' onChange={handleInputChange} value={formData.theme} placeholder='Write the central theme for the story.' />
                </div>
                <Button title='Generate' type="submit" />
                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default ThemeBasedAgeAppropriateStoryGenerator;