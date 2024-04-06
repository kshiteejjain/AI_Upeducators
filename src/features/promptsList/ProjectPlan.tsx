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
        topicSubject: '',
        projectType: '',
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
    const promptMessage = `Generate a detailed Project Plan for ${formData.gradeLevel} covering this Subject / Topic / Learning Objectives: ${formData.topicSubject}. The project type is a ${formData.projectType} Project.
    Along with the Project Plan consider these additional details: ${formData.additionalDetails}.
    Follow this structure in the project plan output: Title, Subject/Topic, Grade Level, Duration, Project Overview, Learning Objectives, Materials/Resources, duration-wise detailed Project Plan, Assessment Criteria, Closure, Reflection.
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
                    <label htmlFor='topicSubject'>Topic / Subject / Learning Objectives
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name="topicSubject"
                        onChange={handleInputChange}
                        value={formData.topicSubject}
                        placeholder="e.g., Gravitational Force, History, Implement the concepts of Perimeter and Area">
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='projectType'>Project Type</label>
                    <input
                        className='form-control'
                        name="projectType"
                        onChange={handleInputChange}
                        value={formData.projectType}
                        placeholder="e.g., Research, Community Service, Group, Case Study, Art and Design, Technology-integrated" />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="e.g., Duration of the Lesson, Special Instructions, Assessment Type, Teaching Method, Learning Environment">
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ProjectPlan;
