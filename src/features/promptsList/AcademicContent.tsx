import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const AcademicContent = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        textLength: '',
        contentType: '',
        specialInstructions: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate original academic content for ${formData.gradeLevel} focusing on the topic ${formData.topic}. The content should be approximately ${formData.textLength} in length. Special instructions: ${formData.specialInstructions}. Additionally, include references and citations. This content should be tailored to be educational and engaging for the specified grade level and subject matter. The content type is ${formData.contentType}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Academic Content</h2>
            <h3>Generates original academic content as per specific criteria.</h3>
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
                        <option value="">Select the grade level for which the content is intended</option>
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
                        placeholder="e.g., Algebra, World War II, Photosynthesis, Gravity, Environmental Science"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='textLength'> Text Length
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="textLength"
                        onChange={handleInputChange}
                        value={formData.textLength}>
                        <option value="">Choose the desired length of the text</option>
                        <option value="Short">Short (up to 200 words)</option>
                        <option value="Medium">Medium (200-400 words)</option>
                        <option value="Long">Long (400-600 words)</option>
                        <option value="Very-Long">Very Long (600-800 words)</option>
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="contentType"> Content Type </label>
                    <input
                        className="form-control"
                        name="contentType"
                        onChange={handleInputChange}
                        value={formData.contentType}
                        placeholder="e.g., Textbook page, Essay, Short Story, Research Paper, News Article"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="specialInstructions"> Special Instructions </label>
                    <textarea
                        className="form-control"
                        name="specialInstructions"
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.specialInstructions}
                        placeholder="e.g., focus on the environmental impacts, include real-world examples">
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default AcademicContent;
