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

const FacebookAd = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    
    const [formData, setFormData] = useState({
        courseName: '',
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
            const promptMessage = `I want to create an ad on ${formData.courseName}, the audience of my course is ${formData.audience} which has the following sections

            A problem statement: which Address a problem your target audience faces, in 6 to 8 words
            Eg: Struggling to stay updated with technology for Education?
            
            Solution : present your product or service as the solution in 8 - 10 words
            Eg: Become a Google certified educator and enhance your teaching skills
            
            Generate 5 such problem - solution statement
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
            <h2>Ad With Problem Solution Statement</h2>
            <h3>Create dynamic and appealing content for Facebook ads in Problem Solution Statement.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='courseName'>Course/Skill Name <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='courseName'
                        onChange={handleInputChange}
                        value={formData.courseName}
                        placeholder='Enter the Course/Skill/Class name you want to promote'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='audience'
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder='Enter the target audience for your ad, such as Parents, Teenagers'
                    />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default FacebookAd;
