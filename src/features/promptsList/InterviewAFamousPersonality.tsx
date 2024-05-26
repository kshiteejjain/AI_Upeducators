import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const InterviewAHistoricalFigure = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        historicalFigure: '',
        interviewQuestion: '',
        answerLength: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate an answer for the interview question ${formData.interviewQuestion} as if you were ${formData.historicalFigure}. 
    The answer should be suitable for ${formData.gradeLevel} students and be ${formData.answerLength} in length. 
    It should reflect the historical figure's perspective and experiences`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Interview a Famous Personality</h2>
            <h3>Generate insightful interview responses from renowned personalities.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level to generate age-appropriate answers."
                    >
                        <option value="">Select the grade level to generate age-appropriate answers.</option>
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

                <div className="form-group">
                    <label htmlFor="nameOfPersonality">Name of the Personality<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="nameOfPersonality"
                        onChange={handleInputChange}
                        value={formData.nameOfPersonality}
                        placeholder="e.g., Bill Gates, Sachin Tendulkar, Mahatma Gandhi"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="interviewQuestion">Interview Question <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="interviewQuestion"
                        onChange={handleInputChange}
                        value={formData.interviewQuestion}
                        placeholder='Type the question you want the personality to answer'
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="answerLength">Answer Length</label>
                    <select
                        className="form-control"
                        name="answerLength"
                        onChange={handleInputChange}
                        value={formData.answerLength}
                        placeholder="Choose the desired length of the interview answer."
                    >
                        <option value="">Choose the desired length of the interview answer.</option>
                        <option value="Short">Short (1-2 sentences)</option>
                        <option value="Medium">Medium (3-5 sentences)</option>
                        <option value="Long">Long (5+ sentences)</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default InterviewAHistoricalFigure;
