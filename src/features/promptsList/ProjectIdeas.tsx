import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ProjectIdeas = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
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
    const promptMessage = `Generate 8 engaging project ideas for ${formData.gradeLevel} students covering the topic ${formData.topic}.
    Consider these additional details: ${formData.additionalDetails}.
    Add the output for each Idea under these headings: 'Project Title' and 'Project Description'`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Project Ideas</h2>
            <h3>Generate innovative project ideas for any given topic.</h3>
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
                        placeholder="Select the grade level for which you need project ideas.">
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
                    <label htmlFor='topic'>Topic
<span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., World History, Forces and Motion, Climate Change, Algebra" />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder={`For Example- Learning Environment (e.g., Classroom, Online, Hybrid), \nProject Type (e.g., Research, Group, Technology-integrated), \nProject Duration (e.g., 1 class period, 1 week, 1 month)`}
                        rows={5}
                    >
                    </textarea>
                </div>



                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ProjectIdeas;
