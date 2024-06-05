import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ProjectPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicOrTitle: '',
        learningObjective: '',
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
    const promptMessage = `Generate a detailed Project Plan for ${formData.gradeLevel} students. The project should be based on this Topic or Title: ${formData.topicOrTitle}.
    Also, consider this Learning Objective Or Project Description: ${formData.learningObjective} and additional details: ${formData.additionalDetails}.
    Follow this structure in the project plan output: Title, Subject/Topic, Grade Level, Duration, Project Overview, Learning Objectives, Materials/Resources, duration-wise detailed Project Plan, Assessment Criteria, Closure, and Reflection.
    In case you want to add something else in the structure to make it better, then you can do it.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Project Plan</h2>
            <h3>Create a comprehensive project plan for students.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which the project is intended.">
                        <option value="">Select the grade level</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st Grade">1st Grade</option>
                        <option value="2nd Grade">2nd Grade</option>
                        <option value="3rd Grade">3rd Grade</option>
                        <option value="4th Grade">4th Grade</option>
                        <option value="5th Grade">5th Grade</option>
                        <option value="6th Grade">6th Grade</option>
                        <option value="7th Grade">7th Grade</option>
                        <option value="8th Grade">8th Grade</option>
                        <option value="9th Grade">9th Grade</option>
                        <option value="10th Grade">10th Grade</option>
                        <option value="11th Grade">11th Grade</option>
                        <option value="12th Grade">12th Grade</option>
                        <option value="College Level">College Level</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='topicOrTitle'>Topic or Title
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="topicOrTitle"
                        onChange={handleInputChange}
                        value={formData.topicOrTitle}
                        placeholder="e.g., Motion and Movement, The Impact of Climate Change, Analysing major Historical Events" />
                </div>

                <div className='form-group'>
                    <label htmlFor='learningObjective'>Learning Objective Or Project Description
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name="learningObjective"
                        onChange={handleInputChange}
                        value={formData.learningObjective}
                        rows={5}
                        placeholder="e.g., Motion and Movement, The Impact of Climate Change, Analysing major Historical Events" />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        rows={5}
                        placeholder={`For Example- Learning Environment (e.g., Classroom, Online, Hybrid), \nProject Type (e.g., Research, Group, Technology-integrated), \nProject Duration (e.g., 1 class period, 1 week, 1 month)`}>
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ProjectPlan;
