import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const RealWorldExamples = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        contextPreference: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 real-world examples on the topic ${formData.topic} for students in ${formData.gradeLevel}. The examples should be detailed enough to connect the topic with the real world.
    The examples should be contextually relevant to ${formData.contextPreference}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Real-World Examples</h2>
            <h3>Generate real-world examples to enhance student understanding.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}>
                        <option value="">Select the grade level of your students</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-grade">3rd Grade</option>
                        <option value="4th-grade">4th Grade</option>
                        <option value="5th-grade">5th Grade</option>
                        <option value="6th-grade">6th Grade</option>
                        <option value="7th-grade">7th Grade</option>
                        <option value="8th-grade">8th Grade</option>
                        <option value="9th-grade">9th Grade</option>
                        <option value="10th-grade">10th Grade</option>
                        <option value="11th-grade">11th Grade</option>
                        <option value="12th-grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="topic"> Topic
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Pythagorean Theorem, World War II, Innovation, Gravity, Other"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="contextPreference"> Context Preference </label>
                    <input
                        className="form-control"
                        name="contextPreference"
                        onChange={handleInputChange}
                        value={formData.contextPreference}
                        placeholder="e.g., Sports, India, Bollywood, Current Events, Politics"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default RealWorldExamples;
