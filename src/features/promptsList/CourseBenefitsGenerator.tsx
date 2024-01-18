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


const EmailContentGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        courseName: '',
        targetAudience: '',
        courseDuration: 'one Month',
        courseFormat: 'online',
        keyTopics: ''
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
            const promptMessage = `Generate a detailed description of the benefits of the course named ${formData.courseName} targeted towards ${formData.targetAudience} The course, which lasts for ${formData.courseDuration} and is offered in a ${formData.courseFormat} format, covers key topics such as ${formData.keyTopics}. This description should highlight how the course will be advantageous for the learners and what unique opportunities it offers.            `

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Course Benefits Generator</h2>
            <h3>Generate a detailed description of the benefits of a particular course, tailored for prospective students or educators.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='courseName'>Course Name <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseName' onChange={handleInputChange} value={formData.courseName} placeholder='Enter the name of the course, e.g., "Advanced Mathematics" or "Introduction to Programming' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the target audience for the course, such as high school students, college students, professionals, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDuration'>Course Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="courseDuration" onChange={handleInputChange} value={formData.courseDuration}>
                        <option value="oneMonth">1 month </option>
                        <option value="twoMonths">3 months </option>
                        <option value="threeMonths">6 months </option>
                        <option value="twelveMonths">12 months</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='courseFormat'> Course Format <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="courseFormat" onChange={handleInputChange} value={formData.courseFormat}>
                        <option value="online">Online </option>
                        <option value="offline">Offline </option>
                        <option value="hybrid">Hybrid </option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyTopics'>Key Topics <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='keyTopics' onChange={handleInputChange} value={formData.keyTopics} placeholder='List the main topics covered in the course, separated by commas.' />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default EmailContentGenerator;