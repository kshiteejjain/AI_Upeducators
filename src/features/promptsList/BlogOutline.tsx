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

const BlogOutline = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        blogTitle: '',
        audience: '',
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
            const promptMessage = `I want to write a blog on ${formData.blogTitle}, the audience of my blog is ${formData.audience}. Please give me the outline of the blog which will help me in writing an engaging blog.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Blog Outline</h2>
            <h3>Generate the detailed outline for your blog title.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='blogTitle'>Blog Title<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='blogTitle'
                        onChange={handleInputChange}
                        value={formData.blogTitle}
                        placeholder='Enter the Title for the Blog'
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
                        placeholder='Identify the target audience for your ad, such as Parents, Teenagers'
                    />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default BlogOutline;
