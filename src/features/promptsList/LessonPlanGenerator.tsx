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


const LessonPlanGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        gradeLevel: 'Nursery',
        subject: '',
        topic: '',
        learningObjectives: '',
        duration: '',
        teachingMethod: 'Lecture',
        assessmentType: 'Quiz',
        additionalNotes: '',
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
            const promptMessage = `Generate a detailed lesson plan for ${formData.gradeLevel} on ${formData.subject}, covering the topic of ${formData.topic}. The lesson will achieve ${formData.learningObjectives}, last ${formData.duration}, use ${formData.teachingMethod}, and include ${formData.assessmentType}, ${formData.additionalNotes}.            `

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Lesson Plan Generator</h2>
            <h3>This form is designed to generate a detailed lesson plan. </h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="Grade1">Grade 1</option>
                        <option value="Grade2">Grade 2</option>
                        <option value="Grade3">Grade 3</option>
                        <option value="Grade4">Grade 4</option>
                        <option value="Grade5">Grade 5</option>
                        <option value="Grade6">Grade 6</option>
                        <option value="Grade7">Grade 7</option>
                        <option value="Grade8">Grade 8</option>
                        <option value="Grade9">Grade 9</option>
                        <option value="Grade10">Grade 10</option>
                        <option value="Grade11">Grade 11</option>
                        <option value="Grade12">Grade 12</option>
                        <option value="CollegeLevel">College Level</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='subject'>Subject <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='subject' onChange={handleInputChange} value={formData.subject} placeholder='Enter the subject for which the lesson plan is being created (e.g., Mathematics, Science, English).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder='Specify the specific topic of the lesson (e.g., Photosynthesis, World War II, Algebra).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='learningObjectives'> Learning Objectives <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='learningObjectives' onChange={handleInputChange} rows={5} value={formData.learningObjectives} placeholder='Describe the learning objectives or goals that the lesson aims to achieve.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration<span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="30 minutes">30 minutes</option>
                        <option value="45 minutes">45 minutes</option>
                        <option value="1 hour">1 hour</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='teachingMethod'>Teaching Method </label>
                    <select required className='form-control' name="teachingMethod" onChange={handleInputChange} value={formData.teachingMethod}>
                        <option value="Lecture">Lecture</option>
                        <option value="Interactive">Interactive</option>
                        <option value="Hands-on">Hands-on</option>
                        <option value="Group Work">Group Work</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='assessmentType'>Assessment Type</label>
                    <select required className='form-control' name="assessmentType" onChange={handleInputChange} value={formData.assessmentType}>
                        <option value="Quiz">Quiz</option>
                        <option value="Oral Presentation">Oral Presentation</option>
                        <option value="Project">Project</option>
                        <option value="Participation">Participation</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalNotes'> Additional Notes</label>
                    <textarea required className='form-control' name='additionalNotes' onChange={handleInputChange} rows={5} value={formData.additionalNotes} placeholder='Any additional instructions or notes relevant to the lesson plan.'> </textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default LessonPlanGenerator;