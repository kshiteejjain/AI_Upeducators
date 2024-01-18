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

const AssignmentCreationTool = () => {
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
        assignmentType: 'Essay',
        difficultyLevel: 'Easy',
        additionalInstructions: '',
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
            const promptMessage = `Create a customized assignment for ${formData.gradeLevel} in ${formData.subject}. The assignment should focus on achieving the following learning objectives: ${formData.learningObjectives}. The assignment type is ${formData.assignmentType}. Set the difficulty level to ${formData.difficultyLevel}. Guidelines or instructions that should be followed in the assignment must include ${formData.additionalInstructions}`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Assignment Creation Tool</h2>
            <h3>Create a customized assignment in various formats for different educational levels and subjects.</h3>
            <form onSubmit={sendPrompt}>
                {/* ... Other form groups ... */}
                <div className='form-group'>
                    <label htmlFor='assignmentType'>Assignment Type <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="assignmentType" onChange={handleInputChange} value={formData.assignmentType}>
                        <option value="Essay">Essay</option>
                        <option value="Report">Report</option>
                        <option value="Case Study">Case Study</option>
                        <option value="Reflective Writing">Reflective Writing</option>
                        <option value="Creative Writing">Creative Writing</option>
                        <option value="Experiment">Experiment</option>
                        <option value="Portfolio">Portfolio</option>
                        <option value="Research Paper">Research Paper</option>
                        <option value="Problem Solving">Problem Solving</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='difficultyLevel'>Difficulty Level</label>
                    <select className='form-control' name="difficultyLevel" onChange={handleInputChange} value={formData.difficultyLevel}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalInstructions'>Additional Instructions</label>
                    <textarea className='form-control' name='additionalInstructions' onChange={handleInputChange} rows={5} value={formData.additionalInstructions} placeholder='Provide any specific instructions or guidelines.'></textarea>
                </div>
                {/* ... Other form groups ... */}
                <Button title='Generate' type="submit" />
                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default AssignmentCreationTool;
