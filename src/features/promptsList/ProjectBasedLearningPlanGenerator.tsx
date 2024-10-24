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

const ProjectBasedLearningPlanGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        projectTitle: '',
        gradeLevel: 'Nursery',
        subjectArea: 'Mathematics',
        projectDuration: '1 hr',
        learningObjectives: '',
        keyResourcesNeeded: '',
        assessmentCriteria: '',
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
            const promptMessage = `Develop a PBL plan for "${formData.projectTitle}" for ${formData.gradeLevel} students in ${formData.subjectArea}. The project will last ${formData.projectDuration}. Learning objectives include: ${formData.learningObjectives}. Key resources needed: ${formData.keyResourcesNeeded}. Assessment criteria: ${formData.assessmentCriteria}`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Project-Based Learning Plan Generator</h2>
            <h3>Create structured plans for project-based learning activities.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='projectTitle'> Project Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='projectTitle' onChange={handleInputChange} value={formData.projectTitle} placeholder='Enter a brief title for the project.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-grade">3rd Grade</option>
                        <option value="4th-grade">4th Grade</option>
                        <option value="5th-grade">5th Grade</option>
                        <option value="6th-grade">6th Grade</option>
                        <option value="7th-grade">7th Grade</option>
                        <option value="8th-grade">8th Grade</option>
                        <option value="9th-grade">9th Grade</option>
                        <option value="10th-grade">10th Grade</option>
                        <option value="11th-grade">11th Grade</option>
                        <option value="12th-grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='subjectArea'> Subject Area <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="subjectArea" onChange={handleInputChange} value={formData.subjectArea}>
                        {/* Options for Subject Area */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='projectDuration'> Project Duration<span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="projectDuration" onChange={handleInputChange} value={formData.projectDuration}>
                        {/* Options for Project Duration */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='learningObjectives'> Learning Objectives </label>
                    <textarea className='form-control' name='learningObjectives' onChange={handleInputChange} rows={5} value={formData.learningObjectives} placeholder='Describe what students should learn or achieve by the end of the project.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyResourcesNeeded'> Key Resources Needed </label>
                    <textarea className='form-control' name='keyResourcesNeeded' onChange={handleInputChange} rows={5} value={formData.keyResourcesNeeded} placeholder='List the main materials or resources required for the project.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='assessmentCriteria'> Assessment Criteria </label>
                    <textarea className='form-control' name='assessmentCriteria' onChange={handleInputChange} rows={5} value={formData.assessmentCriteria} placeholder='Specify how the students’ work will be evaluated.'></textarea>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default ProjectBasedLearningPlanGenerator;
