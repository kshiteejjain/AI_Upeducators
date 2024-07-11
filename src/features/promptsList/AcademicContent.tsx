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
        otherTextLength: '', // New state for handling 'Other' text length
        contentType: '',
        otherContentType: '', // New state for handling 'Other' content type
        specialInstructions: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Update formData based on input type
        if (name === 'textLength' && value === 'Other') {
            setFormData((prevData) => ({
                ...prevData,
                textLength: value,
                otherTextLength: '', // Reset other text length input when selecting 'Other'
            }));
        } else if (name === 'contentType' && value === 'Other') {
            setFormData((prevData) => ({
                ...prevData,
                contentType: value,
                otherContentType: '', // Reset other content type input when selecting 'Other'
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const promptMessage = `Generate original academic content for ${formData.gradeLevel} focusing on this Topic / Learning Objective: ${formData.topic}. The content should be approximately ${formData.textLength === 'Other' ? formData.otherTextLength : formData.textLength} in length. Special instructions: ${formData.specialInstructions}. Additionally, include references and citations. This content should be tailored to be educational and engaging for the specified grade level and subject matter. The content type is ${formData.contentType === 'Other' ? formData.otherContentType : formData.contentType}.`;
    console.log(promptMessage)
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Academic Content</h2>
            <h3>Generate original academic content as per specific criteria.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level<span className="asterisk">*</span></label>
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
                    <label htmlFor="topic"> Topic / Learning Objective<span className="asterisk">*</span></label>
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
                    <label htmlFor='textLength'> Text Length<span className="asterisk">*</span></label>
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
                        <option value="Other">Other</option>
                    </select>
                </div>
                {formData.textLength === 'Other' && (
                    <div className='form-group'>
                        <label htmlFor='otherQuestionType'>Other<span className="asterisk">*</span></label>
                        <input
                            className="form-control"
                            name="otherTextLength"
                            onChange={handleInputChange}
                            value={formData.otherTextLength}
                            placeholder="Specify other text length"
                        />
                    </div>
                )}

                <div className="form-group">
                    <label> Content Type<span className="asterisk">*</span></label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Textbook page"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Textbook page'}
                        /> Textbook page
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Flow Chart"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Flow Chart'}
                        /> Flow Chart
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Timeline/Chronology"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Timeline/Chronology'}
                        /> Timeline/Chronology
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Essay"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Essay'}
                        /> Essay
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Short Story"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Short Story'}
                        /> Short Story
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Research Paper"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Research Paper'}
                        /> Research Paper
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="News Article"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'News Article'}
                        /> News Article
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="contentType"
                            value="Other"
                            onChange={handleInputChange}
                            checked={formData.contentType === 'Other'}
                        /> Other
                    </label>
                </div>
                {formData.contentType === 'Other' && (
                        <div className='form-group'>
                            <label htmlFor='otherQuestionType'>Other<span className="asterisk">*</span></label>
                            <input
                                className="form-control"
                                name="otherContentType"
                                onChange={handleInputChange}
                                value={formData.otherContentType}
                                placeholder="Specify other content type"
                            />
                        </div>
                    )}

                <div className="form-group">
                    <label htmlFor="specialInstructions"> Special Instructions </label>
                    <textarea
                        className="form-control"
                        name="specialInstructions"
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.specialInstructions}
                        placeholder="e.g., include real-world examples, incorporate statistical data, provide case studies, focus on recent trends"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};

export default AcademicContent;
