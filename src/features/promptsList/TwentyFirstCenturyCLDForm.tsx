import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TwentyFirstCenturyCLDForm = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: 'Nursery',
        subject: '',
        topic: '',
        twentyFirstCenturySkills: [] as string[],
        learningObjectives: '',
        duration: '',
        teachingMethod: 'Project-Based',
        assessmentType: '',
        additionalNotes: '',
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
    const promptMessage = `Generate a detailed lesson plan for ${formData.gradeLevel} on ${formData.subject}, covering the topic of ${formData.topic}. This lesson focuses on ${skillsText} and aims to achieve ${formData.learningObjectives}. The lesson will last ${formData.duration}, and will use ${formData.teachingMethod} to engage students. Assessment will be through ${formData.assessmentType}, ${formData.additionalNotes}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>21st Century CLD based Lesson Plan</h2>
            <h3>This form is designed to help educators create lesson plans that integrate 21st Century Competencies, focusing on fostering critical thinking, creativity, collaboration, and communication among students.</h3>
            <form onSubmit={handleSubmit}>
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
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder='Specify the specific topic of the lesson (e.g., Environmental Sustainability, Digital Literacy).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='twentyFirstCenturySkills'>21st Century Skills <span className='asterisk'>*</span></label>
                    <div className="checkbox-options">
                        {["Critical Thinking", "Creativity", "Collaboration", "Communication", "Problem-solving", "Innovation", "Teamwork", "Interpersonal skills", "Technology literacy", "Inquiry", "Adaptability"].map(skill => (
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
                    <label htmlFor='learningObjectives'> Learning Objectives <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='learningObjectives' onChange={handleInputChange} rows={5} value={formData.learningObjectives} placeholder='Describe the learning objectives or goals that the lesson aims to achieve.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration (Optional) </label>
                    <select className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="30 minutes">30 minutes</option>
                        <option value="45 minutes">45 minutes</option>
                        <option value="1 hour">1 hour</option>
                        <option value="90 minutes">90 minutes</option>
                        <option value="3 days">3 days</option>
                        <option value="5 days">5 days</option>
                        {/* Add more options as needed */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='teachingMethod'>Teaching Method <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="teachingMethod" onChange={handleInputChange} value={formData.teachingMethod}>
                        <option value="Project-Based">Project-Based</option>
                        <option value="Inquiry-Based">Inquiry-Based</option>
                        <option value="Collaborative Learning">Collaborative Learning</option>
                        {/* Add more options as needed */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='assessmentType'>Assessment Type (Optional) </label>
                    <select className='form-control' name="assessmentType" onChange={handleInputChange} value={formData.assessmentType}>
                        <option value="Reflective Journal">Reflective Journal</option>
                        <option value="Presentation">Presentation</option>
                        <option value="Group Project">Group Project</option>
                        <option value="Peer Review">Peer Review</option>
                        {/* Add more options as needed */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalNotes'> Additional Notes (Optional) </label>
                    <textarea className='form-control' name='additionalNotes' onChange={handleInputChange} rows={5} value={formData.additionalNotes} placeholder='Any additional instructions or notes relevant to the lesson plan.'> </textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default TwentyFirstCenturyCLDForm;
