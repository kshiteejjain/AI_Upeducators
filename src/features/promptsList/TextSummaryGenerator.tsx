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

const TextSummaryGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        textContent: '',
        summaryLength: 'Short',
        keyPoints: '',
        purposeOfSummary: '',
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
            const promptMessage = `Generate a summary for the text "${formData.textContent}". The summary should be ${formData.summaryLength.toLowerCase()}, focusing on key points such as ${formData.keyPoints}. The summary is intended for ${formData.purposeOfSummary} for ${formData.targetAudience}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Text Summary Generator</h2>
            <h3>This form is designed to assist in creating concise and accurate summaries of provided text materials.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='textContent'> Text Content <span className='asterisk'>*</span> </label>
                    <textarea required className='form-control' name='textContent' onChange={handleInputChange} rows={5} value={formData.textContent} placeholder='Paste the text you want to summarize here.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='summaryLength'> Summary Length <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="summaryLength" onChange={handleInputChange} value={formData.summaryLength}>
                        <option value="Short">Short (1-2 sentences)</option>
                        <option value="Medium">Medium (1 paragraph)</option>
                        <option value="Long">Long (2-3 paragraphs)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyPoints'> Key Points to Highlight </label>
                    <textarea className='form-control' name='keyPoints' onChange={handleInputChange} rows={5} value={formData.keyPoints} placeholder='Mention any specific points, themes, or aspects that should be emphasized in the summary.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='purposeOfSummary'> Purpose of Summary </label>
                    <input className='form-control' name='purposeOfSummary' onChange={handleInputChange} value={formData.purposeOfSummary} placeholder='Specify the purpose of the summary (e.g., academic review, general understanding, presentation).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'> Target Audience </label>
                    <input className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the audience (e.g., class 9th students, Educators).' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default TextSummaryGenerator;
