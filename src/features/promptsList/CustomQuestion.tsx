import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CustomQuestion = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        questionType: '',
        topic: '',
        difficultyLevel: '',
        contextPreference: 1,
        additionalDetails: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 ${formData.questionType} questions for ${formData.gradeLevel} on ${formData.topic}. It should be framed within the context of ${formData.contextPreference} at a ${formData.difficultyLevel} difficulty level. Also, consider these additional details: ${formData.additionalDetails}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Custom Question Generator</h2>
            <h3>This form helps create tailored questions for educational or training purposes.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which the questions are being created">
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


                <div className='form-group'>
                    <label htmlFor='questionType'> Question Type <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="questionType"
                        onChange={handleInputChange}
                        value={formData.questionType}
                        placeholder="e.g., Multiple Choice, True/False, Short Answer, Essay, Fill in the Blanks, Match the Following"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='topic'> Topic <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Environmental Awareness, World War II, Algebra, Photosynthesis, Gravity"
                    />
                </div>

                <div className='form-group'>
                    <label> Difficulty Level </label>
                    <div className='checkbox-group'>
                        <div className='checkbox'>
                            <input type="checkbox" id="easy" name="easy" onChange={handleInputChange} value={formData.difficultyLevel} />
                            <label htmlFor="easy">Easy</label>
                        </div>
                        <div className='checkbox'>
                            <input type="checkbox" id="medium" name="medium" onChange={handleInputChange} value={formData.difficultyLevel} />
                            <label htmlFor="medium">Medium</label>
                        </div>
                        <div className='checkbox'>
                            <input type="checkbox" id="hard" name="hard" onChange={handleInputChange} value={formData.difficultyLevel} />
                            <label htmlFor="hard">Hard</label>
                        </div>
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='contextPreference'> Context Preference </label>
                    <input
                        className="form-control"
                        name="contextPreference"
                        onChange={handleInputChange}
                        value={formData.contextPreference}
                        placeholder="Mention the context or theme in which you prefer the questions to be framed (e.g., Cricket, Harry Potter, Space Exploration)"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <input
                        className="form-control"
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="e.g., word limit for essay questions, structure for multiple-choice options, any specific requirement"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default CustomQuestion;
