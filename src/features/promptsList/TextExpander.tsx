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

const TextExpander = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        text: '',
        wordLimit: '',
        tone: 'Professional'
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
            const promptMessage = `Take the following text and expand on it. It may be necessary to recreate the text in a more comprehensive manner.

            Text is ${formData.text}. Word limit is ${formData.wordLimit} words. Tone: ${formData.tone}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Text Expander</h2>
            <h3>Quickly generate more detailed and comprehensive content with ease.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='text'>Text<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='text'
                        onChange={handleInputChange}
                        value={formData.text}
                        placeholder='Enter the Text you want to Expand'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='wordLimit'>Word limit</label>
                    <input
                        type='number'
                        className='form-control'
                        name='wordLimit'
                        onChange={handleInputChange}
                        value={formData.wordLimit}
                        placeholder='Enter the number of words you want'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='tone'>Tone</label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.tone}>
                        <option value="Professional">Professional</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Informative">Informative</option>
                        <option value="Persuasive">Persuasive</option>
                        <option value="Casual">Casual</option>
                        <option value="Inspirational">Inspirational</option>
                        <option value="Authoritative">Authoritative</option>
                        <option value="Playful">Playful</option>
                        <option value="Educational">Educational</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default TextExpander;
