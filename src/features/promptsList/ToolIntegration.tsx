import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ToolIntegration = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicSubject: '',
        desiredToolFunctionality: '',
        specificRequirements: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 suggestions for educational tools that can be integrated with the Topic/Subject of ${formData.topicSubject} for ${formData.gradeLevel} students. The tool should provide ${formData.desiredToolFunctionality} functionality. 
    Consider these specific requirements: ${formData.specificRequirements}.
    Provide a description within 25 words and the URL to their web page.`;
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Tool Integration</h2>
            <h3>Find tools that can be integrated into educational content for any topic.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which you need tool suggestions."
                    >
                        <option value="">Select the grade level for which you need tool suggestions.</option>
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
                        <option value="Working Professionals">Working Professionals</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="topicSubject">Topic/Subject <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topicSubject"
                        onChange={handleInputChange}
                        value={formData.topicSubject}
                        placeholder="Examples: Digestive System, Gravity, Mathematics, Literature"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="desiredToolFunctionality">Desired Tool Functionality <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="desiredToolFunctionality"
                        onChange={handleInputChange}
                        value={formData.desiredToolFunctionality}
                        placeholder="Choose the primary functionality you're looking for in a tool (e.g., Content Creation, Classroom Management, Student Engagement, Assessment, Collaboration, Gamification)"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="specificRequirements">Specific Requirements</label>
                    <textarea
                        className="form-control"
                        name="specificRequirements"
                        onChange={handleInputChange}
                        value={formData.specificRequirements}
                        placeholder="e.g., must be compatible with Google Classroom, needs to support remote learning, any specific need or constraint"
                        rows={5}
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ToolIntegration;
