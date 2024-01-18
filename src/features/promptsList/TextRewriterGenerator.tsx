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

const TextRewriterGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        originalText: '',
        desiredTone: 'Academic',
        textLength: '200',
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
            const promptMessage = `Rewrite the following text: "${formData.originalText}". The rewritten text should have a "${formData.desiredTone}" tone, be "${formData.textLength}" words in length, tailored for "${formData.targetAudience}".`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Text Rewriter Generator</h2>
            <h3>Create a tool to rephrase or rewrite given text in a more engaging, simplified, or formal tone while maintaining the original meaning.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='originalText'>Original Text <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='originalText' onChange={handleInputChange} rows={5} value={formData.originalText} placeholder='Enter the text you want to rewrite.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='desiredTone'>Desired Tone <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="desiredTone" onChange={handleInputChange} value={formData.desiredTone}>
                        <option value="Academic">Academic</option>
                        <option value="Informal">Informal</option>
                        <option value="Business">Business</option>
                        <option value="Creative">Creative</option>
                        <option value="Simplified">Simplified</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='textLength'>Text Length (no. of Words) <span className='asterisk'>*</span></label>
                    <input type='text' className='form-control' name='textLength' onChange={handleInputChange} value={formData.textLength} placeholder='200' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience</label>
                    <input type='text' className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the audience (e.g., Class 9th students, Educators).' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    );
};

export default TextRewriterGenerator;
