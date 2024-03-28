import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ExemplarAndNonExemplar = () => {
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
    const promptMessage = `Generate 5 pairs of exemplar and non-exemplar items for ${formData.gradeLevel} students focusing on the topic/concept of: ${formData.topicConcept}. 
    Consider the Example below for generating the output:
    Exemplar:
    Subject: Thank You Letter
    Content: A letter thanking a local firefighter for their bravery during a recent fire in the community. It includes specific details about the firefighter's actions and expresses gratitude for their service.
    Non-Exemplar:
    Subject: Thank You Letter
    Content: A letter vaguely thanking a friend for a gift received. It lacks specific details or personalization, and the language is casual and informal. The closing is abrupt and lacks sincerity.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Exemplar and Non-Exemplar</h2>
            <h3>Generate correct and incorrect examples or concepts.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level <span className="asterisk">*</span></label>
                    <select className="form-control" name="gradeLevel" required onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the grade level for which the exemplars and non-exemplars are being created.</option>
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
                    <label htmlFor="topicConcept">Topic/Concept <span className="asterisk">*</span></label>
                    <input type="text" className="form-control" name="topicConcept" required onChange={handleInputChange} value={formData.topicConcept} placeholder="e.g., Mathematics, History, Pythagorean Theorem, Letter Writing" />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ExemplarAndNonExemplar;
