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

const SocialMediaCalendarGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        noOfDays: '',
        selectDays: 'days',
        audience: '',
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
            const promptMessage = `Create a social media calendar for ${formData.noOfDays} days in a table. My audience is ${formData.audience}. Theme is ${formData.theme}. Content ideas should be engaging so that posts get more likes, comments, saves and shares and also promote follows and should cover all popular formats mentioning the format. Table should have Serial number, Content idea and Format.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Social Media Calendar Generator</h2>
            <h3>Generate Effective Sales pitch for your Services to convert your Prospects.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='noOfDays'>Number of Days/months <span className='asterisk'>*</span></label>
                    <input type='number' required className='form-control' name='noOfDays' onChange={handleInputChange} value={formData.noOfDays} placeholder='Enter the number of days/months for the social media calendar.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='selectDays'>Select Days/months <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="selectDays" onChange={handleInputChange} value={formData.selectDays}>
                        <option value="days">Days</option>
                        <option value="months">Months</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience<span className='asterisk'>*</span></label>
                    <input type='text' className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Identify your primary audience, such as students, parents, or educators.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='theme'>Themes/Topics</label>
                    <input type='text' className='form-control' name='theme' onChange={handleInputChange} value={formData.theme} placeholder='Describe the central themes or topics for your posts, like educational tips or course information. Ex: yoga tips for kids.' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    );
};

export default SocialMediaCalendarGenerator;
