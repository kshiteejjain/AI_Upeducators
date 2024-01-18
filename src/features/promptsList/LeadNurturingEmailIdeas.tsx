import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
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

const LeadNurturingEmailIdeas = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    
    const [formData, setFormData] = useState({
        topic: '',
        audience: ''
    });

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `Topic is ${formData.topic}
            I want to add leads for the topic into an email drip campaign. Audience is ${formData.audience}
            
            Give me a 6 month plan, with weekly emails, using catchy email headlines, that will turn a cold lead into a warm prospect.
            
            Give it to me in the format
            Week 1
            Headline:
            
            A headline can only contain 70 characters.
            
            You can use these examples to understand email headline best practices
            
            - using a number like 3 Secrets
            - using statements like "What 98% are doing wrong"
            - Adding something in brackets like "in 2023" or "7 steps"
            - cause curiosity "I just had to share this with you"
            - Case Study like What "name" did to get 100 leads
            - Heartfelt message Why I decided to coach on "topic"
            - Make something easier - It's not difficult to do "this". Here is why
            - Create a villain - Why someone hate me
            - Be witty - My mom asked me to share this with you
            `;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Lead Nurturing Email Ideas</h2>
            <h3>Generate innovative and engaging email ideas for lead nurturing campaigns.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='topic'>Topic<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='topic'
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder='Enter the Topic/Course name/Class name you provide'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='audience'
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder='Enter the target audience, such as Parents, Teenagers'
                    />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default LeadNurturingEmailIdeas;
