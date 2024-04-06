import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ScienceLabExperiment = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        scienceTopic: '',
        additionalDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a detailed and elaborated plan for a science lab experiment for ${formData.gradeLevel} students considering this Science Topic / Learning Objectives: ${formData.scienceTopic}. 
    Also consider these additional details: ${formData.additionalDetails}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Science Lab Experiment </h2>
            <h3>Generate science lab experiments for students. </h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level of your students.">
                        <option value="">Select the grade level</option>
                        <option value="Kindergarten">Kindergarten</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-Grade">3rd Grade</option>
                        <option value="4th-Grade">4th Grade</option>
                        <option value="5th-Grade">5th Grade</option>
                        <option value="6th-Grade">6th Grade</option>
                        <option value="7th-Grade">7th Grade</option>
                        <option value="8th-Grade">8th Grade</option>
                        <option value="9th-Grade">9th Grade</option>
                        <option value="10th-Grade">10th Grade</option>
                        <option value="11th-Grade">11th Grade</option>
                        <option value="12th-Grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='scienceTopic'> Science Topic / Learning Objectives
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='scienceTopic'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.scienceTopic}
                        placeholder='e.g., Photosynthesis, Newton&apos;s Laws, Understanding the properties of acids and bases.'>
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder='For Example- Experiment Type (e.g., Demonstration, Student-Led, Group Activity), Safety Concerns (e.g., use of chemicals, precautions to consider, heat sources), Duration (e.g., 30 minutes, 2 class periods), Equipment Needed, Standards Alignment.'>
                    </textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ScienceLabExperiment;
