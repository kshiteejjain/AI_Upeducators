import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const GamificationIdeas = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicSubjectLearningObjective: '',
        learningEnvironment: '',
        additionalRequirements: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 8 gamification ideas for the students of ${formData.gradeLevel} in a ${formData.learningEnvironment} learning environment. Consider this Topic/Subject/Learning Objective: ${formData.topicSubjectLearningObjective}
    Also, consider these additional requirements: ${formData.additionalRequirements}. 
    The concept should be engaging, motivating, and relevant to the educational objectives`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Gamification Ideas</h2>
            <h3>Generate ideas for educational gamification activities.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                    >
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

                <div className="form-group">
                    <label htmlFor="topicSubjectLearningObjective">Topic/Subject/Learning Objective<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="topicSubjectLearningObjective"
                        onChange={handleInputChange}
                        value={formData.topicSubjectLearningObjective}
                        placeholder="e.g., Adjectives, Science, Improve multiplication skills, Enhance historical understanding"
                        rows={5}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="learningEnvironment">Learning Environment<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="learningEnvironment"
                        onChange={handleInputChange}
                        value={formData.learningEnvironment}
                    >
                        <option value="Classroom">Classroom</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Informal">Informal</option>
                        <option value="Outdoor">Outdoor</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="additionalRequirements">Additional Requirements</label>
                    <textarea
                        className="form-control"
                        name="additionalRequirements"
                        onChange={handleInputChange}
                        value={formData.additionalRequirements}
                        placeholder="For Example: Gamification Elements (e.g., Points, Badges, Levels, Quests, Challenges), Duration (e.g., 30 Minutes, 2 Class periods), Difficulty Level (e.g., Easy, Medium, Hard), Implement Tech Integration"
                        rows={5}
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default GamificationIdeas;
