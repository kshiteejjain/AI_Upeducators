import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const InterdisciplinaryProjectPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicOrTitle: '',
        topicLearningObjectives: '',
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
    const promptMessage = `Generate a detailed Interdisciplinary Project Plan for ${formData.gradeLevel} students. The project should be based on this Topic or Title: ${formData.topicOrTitle}.
    Also, consider this Learning Objective Or Project Description: ${formData.topicLearningObjectives} and additional details: ${formData.additionalDetails}. 
    Follow this structure in the output: Title, Grade, Duration, Project Overview, Learning Objectives, Resources needed, Interdisciplinary Integration, duration-wise detailed  Project Plan, Assessment, and Reflection.
    In case you want to add something else in the structure to make it better, then you can do it.`;
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Interdisciplinary Project Plan</h2>
            <h3>Generate a project plan that integrates different disciplines</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which the project is intended.">
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
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
                    <label htmlFor='topicOrTitle'> Topic or Title<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topicOrTitle"
                        onChange={handleInputChange}
                        value={formData.topicOrTitle}
                        placeholder="e.g., Latitude & Longitude Puzzle Quest, Math and Art Fusion"
                    />
                </div>


                <div className='form-group'>
                    <label htmlFor='topicLearningObjectives'> Learning Objective Or Project Description<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='topicLearningObjectives'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.topicLearningObjectives}
                        placeholder={`e.g., Analyzing geographic data using statistical techniques, \nUsing visual artworks as prompts for creative writing activities`}
                    ></textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder={`For Example- Any Special Instruction, \nLearning Environment (e.g., Classroom, Online, Hybrid), \nProject Type (e.g., Research, Problem-solving, Collaborative), \nProject Duration (e.g.,1 class period, 1 week, 1 month`}
                    ></textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default InterdisciplinaryProjectPlan;
