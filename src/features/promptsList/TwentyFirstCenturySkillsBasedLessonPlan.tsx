import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TwentyFirstCenturySkillsBasedLessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicSubject: '',
        additionalDetails: '',
        twentyFirstCenturySkills: [] as string[],
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            twentyFirstCenturySkills: prevData.twentyFirstCenturySkills.includes(value)
                ? prevData.twentyFirstCenturySkills.filter(skill => skill !== value)
                : [...prevData.twentyFirstCenturySkills, value],
        }));
    };
    const skillsText = formData.twentyFirstCenturySkills.join(', ');
    const promptMessage = `Generate a detailed lesson plan for ${formData.gradeLevel} students focusing on this Subject / Topic / Learning Objectives: ${formData.topicSubject}.  
    The lesson plan should be based on these 21st-century Skills: ${skillsText}.
   Along with the detailed plan consider these additional details: ${formData.additionalDetails}
   Show the skills to be achieved explicitly in the lesson plan`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    console.log('promptMessage', promptMessage)
    return (
        <div className="generator-section">
            <h2>21st Century Skills-based Lesson Plan</h2>
            <h3>This form is designed to help educators create lesson plans that integrate 21st Century Competencies, focusing on fostering critical thinking, creativity, collaboration, and communication among students.</h3>
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
                        placeholder="Select the grade level for which the lesson plan is intended.">
                        <option value="">Select the grade level</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                        <option value="Grade 6">Grade 6</option>
                        <option value="Grade 7">Grade 7</option>
                        <option value="Grade 8">Grade 8</option>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                        <option value="College Level">College Level</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='topicSubject'>Topic / Subject / Learning Objectives
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="topicSubject"
                        onChange={handleInputChange}
                        value={formData.topicSubject}
                        placeholder="e.g., Gravitational Force, English, Implement the concepts of Perimeter and Area" />
                </div>

                <div className='form-group'>
                    <label htmlFor='twentyFirstCenturySkills'>21st Century Skills <span className='asterisk'>*</span></label>
                    <div className="checkbox-options">
                        {["Critical Thinking", "Creativity", "Collaboration", "Communication", "Problem-solving", "Innovation", "Teamwork", "Interpersonal skills", "Technology literacy", "Adaptability", "Leadership and Responsibility", "Initiative and Self-direction"].map(skill => (
                            <div key={skill} className="checkbox-option">
                                <input
                                    type="checkbox"
                                    name="twentyFirstCenturySkills"
                                    value={skill}
                                    checked={formData.twentyFirstCenturySkills.includes(skill)}
                                    onChange={handleCheckboxChange}
                                />
                                <label htmlFor='twentyFirstCenturySkills'>{skill}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder="e.g., Duration of the Lesson, Special Instructions, Assessment Type, Teaching Method, Learning Environment">
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default TwentyFirstCenturySkillsBasedLessonPlan;
