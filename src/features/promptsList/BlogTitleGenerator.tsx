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


const BlogTitleGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        audience: '',
        topic: '',
        tone: 'Informative',
        keywords: ''
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
            const promptMessage = `Generate 5 engaging blog titles for the topic ${formData.topic}, tailored to the audience ${formData.audience}. If provided, include a ${formData.tone} tone and incorporate the keywords ${formData.keywords}. The titles should be attention-grabbing and resonate with the target audience.            `

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Blog Title Generator</h2>
            <h3>Generate captivating and relevant blog titles for various topics to engage a specific audience.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify the target audience, such as educators, students, parents, tech enthusiasts, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='topic'>Topic</label>
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder='Describe the blog topic, like "Online Learning Trends" or "Innovative Classroom Technologies".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='tone'> Tone <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="tone" onChange={handleInputChange} value={formData.tone}>
                        <option value="Informative"> Informative</option>
                        <option value="Persuasive">Persuasive</option>
                        <option value="Beginner">Entertaining</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keywords'>Keywords</label>
                    <input required className='form-control' name='keywords' onChange={handleInputChange} value={formData.keywords} placeholder=' Include specific keywords or phrases to be featured in the blog title for SEO purposes.' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default BlogTitleGenerator;