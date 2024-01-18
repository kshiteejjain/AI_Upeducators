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


const SEOContentGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        pageTopic: '',
        targetAudience: '',
        primaryKeyword: '',
        secondaryKeyword: ''
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
            const promptMessage = `Generate an SEO title tag (50-60 characters), meta description (150-160 characters), and a list of keywords for a web page about "${formData.pageTopic}" targeted at "${formData.targetAudience}". The primary keyword is "${formData.primaryKeyword}", and secondary keywords include ${formData.secondaryKeyword}.            `

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>SEO Content Generator</h2>
            <h3>Generate SEO-optimized content for web pages, including a title tag, meta description, and keywords.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='pageTopic'>Page Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='pageTopic' onChange={handleInputChange} value={formData.pageTopic} placeholder='Enter the main topic of the page (e.g., "Online Education Tools").' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the target audience for the page (e.g., "Teachers, Educators").' />
                </div>
                <div className='form-group'>
                    <label htmlFor='primaryKeyword'>Primary Keyword <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='primaryKeyword' onChange={handleInputChange} value={formData.primaryKeyword} placeholder='Enter the primary keyword or phrase for SEO (e.g., "Best Online Teaching Platforms").' />
                </div>
                <div className='form-group'>
                    <label htmlFor='secondaryKeyword'>Secondary Keyword <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='secondaryKeyword' onChange={handleInputChange} value={formData.secondaryKeyword} placeholder='Enter the primary keyword or phrase for SEO (e.g., "Best Online Teaching Platforms").' />
                </div>
                

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default SEOContentGenerator;