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

const EmailContentNurturing = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    
    const [formData, setFormData] = useState({
        emailSubject: '',
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
            const promptMessage = `Email Headline: ${formData.emailSubject}

            Convert this headline into a 125 word email. Audience for the email is ${formData.audience}. Be to the point. Use short sentences and short paragraphs. Have a powerful intro in your email, with a hook, so people read further
            
            Don't just use content from the system prompt. Use anything that you think the reader will appreciate. Give what is promised in the email headline in the email itself and don't use that as a hook to get people to buy
            
            80% of the content should add value, and 20% points them towards signing up or registration
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
            <h2>Email Content: Nurturing</h2>
            <h3>Generate effective email content on the basis of lead nurturing ideas.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='emailSubject'>Email Subject <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='emailSubject'
                        onChange={handleInputChange}
                        value={formData.emailSubject}
                        placeholder='Enter the Email Subject'
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

export default EmailContentNurturing;
