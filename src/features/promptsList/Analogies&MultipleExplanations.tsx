import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const AnalogiesMultipleExplanations = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicConcept: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 types of explanations for the concept: ${formData.topicConcept} for ${formData.gradeLevel} students. Each explanation should offer a unique perspective and be accompanied by an analogy to aid understanding. 
    Follow this Structure for each of the explanations: 'Concept' description, detailed 'Explanation', 'Analogy'. 
    In case you want to add something else in the structure to make it better, then you can do it.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Analogies & Multiple Explanations</h2>
            <h3>Generate multiple explanations and analogies of concepts.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select className="form-control" name="gradeLevel"  onChange={handleInputChange} value={formData.gradeLevel} required>
                        <option value="">Select the grade level of your students.</option>
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
                    <label htmlFor="topicConcept">Topic/Concept<span className="asterisk">*</span></label>
                    <input type="text" className="form-control" name="topicConcept"  onChange={handleInputChange} value={formData.topicConcept} required placeholder="e.g., Photosynthesis, Pythagoras Theorem, World War II, Gravity" />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default AnalogiesMultipleExplanations;
