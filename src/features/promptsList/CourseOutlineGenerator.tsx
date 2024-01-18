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

const CourseOutlineGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        courseTitle: '',
        audience: 'General',
        courseDuration: '',
        contentDeliveryMode: 'Online',
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
            const promptMessage = `Create a course outline for "${formData.courseTitle}" for ${formData.audience}. The course duration is ${formData.courseDuration}. Content will be delivered through ${formData.contentDeliveryMode}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Course Outline Generator</h2>
            <h3>This tool assists in creating detailed outlines for academic or training courses, planning course content and delivery.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='courseTitle'> Course Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='courseTitle' onChange={handleInputChange} value={formData.courseTitle} placeholder='Enter the title of the course.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'> Audience </label>
                    <select className='form-control' name="audience" onChange={handleInputChange} value={formData.audience}>
                        <option value="General">General</option>
                        <option value="Students">Students</option>
                        <option value="Professionals">Professionals</option>
                        <option value="Educators">Educators</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDuration'> Course Duration <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseDuration' onChange={handleInputChange} value={formData.courseDuration} placeholder='Specify the total duration of the course (e.g., 10 weeks, 6 months).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='contentDeliveryMode'> Content Delivery Mode <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="contentDeliveryMode" onChange={handleInputChange} value={formData.contentDeliveryMode}>
                        <option value="Online">Online</option>
                        <option value="In-person">In-person</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Self-paced">Self-paced</option>
                        <option value="Instructor-led">Instructor-led</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    );
};

export default CourseOutlineGenerator;
