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

const TextTranslatorGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        originalText: '',
        targetLanguage: 'English',
        contextOrDomain: '',
        targetAudience: '',
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
            const promptMessage = `Translate the following text to ${formData.targetLanguage}: "${formData.originalText}". The text is related to ${formData.contextOrDomain}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Text Translator Generator</h2>
            <h3>This tool translates text from one language to another while maintaining the original meaning.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='originalText'> Original Text <span className='asterisk'>*</span> </label>
                    <textarea required className='form-control' name='originalText' onChange={handleInputChange} rows={5} value={formData.originalText} placeholder='Enter the text you want to translate.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='targetLanguage'> Target Language <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="targetLanguage" onChange={handleInputChange} value={formData.targetLanguage}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Russian">Russian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Italian">Italian</option>
                        {/* Add other languages as needed */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='contextOrDomain'> Context or Domain</label>
                    <input className='form-control' name='contextOrDomain' onChange={handleInputChange} value={formData.contextOrDomain} placeholder='Describe the context or domain of the text (e.g., education, technical, business, casual).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'> Target Audience <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Write the specified audience (e.g., class 11 students).' />
                </div>

                <Button title='Translate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default TextTranslatorGenerator;
