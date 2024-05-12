import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const VocabularyBasedTexts = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        vocabularyList: '',
        textLength: '',
        contentType: '',
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
    const promptMessage = `${formData.textLength} original text for ${formData.gradeLevel} on the topic of ${formData.topic}, incorporating the following vocabulary words: ${formData.vocabularyList}. 
    The content should be engaging, age-appropriate, and contextually use the vocabulary words to enhance learning and comprehension. 
    The content type should be ${formData.contentType}.
    Also, consider these additional details: ${formData.additionalDetails}`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Vocabulary Based Texts</h2>
            <h3>Create texts incorporating a specific vocabulary list.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select required className="form-control" name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the grade level for which the text is being created</option>
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
                    <label htmlFor="topic">Topic<span className="asterisk">*</span></label>
                    <textarea required className="form-control" name="topic" onChange={handleInputChange} value={formData.topic} rows={5} placeholder="e.g., Environmental Science, World History, Innovation, Gravity"></textarea>
                </div>


                <div className="form-group">
                    <label htmlFor="vocabularyList">Vocabulary List<span className="asterisk">*</span></label>
                    <textarea required className="form-control" name="vocabularyList" onChange={handleInputChange} value={formData.vocabularyList} rows={5} placeholder="Enter the list of vocabulary words to be included in the text, separated by commas (e.g., Climate Change, Ecosystem, Biodiversity)."></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="textLength">Text Length<span className="asterisk">*</span></label>
                    <select required className="form-control" name="textLength" onChange={handleInputChange} value={formData.textLength}>
                        <option value="">Choose the desired length of the text</option>
                        <option value="Short">Short (up to 200 words)</option>
                        <option value="Medium">Medium (200-400 words)</option>
                        <option value="Long">Long (400-600 words)</option>
                        <option value="Very-Long">Very Long (600-800 words)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="contentType">Content Type</label>
                    <input className="form-control" name="contentType" onChange={handleInputChange} value={formData.contentType} placeholder="e.g., Textbook page, Essay, Short Story, Research Paper, News Article" />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <textarea className="form-control" name="additionalDetails" onChange={handleInputChange} value={formData.additionalDetails} rows={5} placeholder="For Example- Specific Theme (e.g., Fiction, Friendship, Adventure, Mystery) Customization of Characters (e.g., character names, character background) Setting (e.g., Historical, Modern City, Outer Space) Any other additional requirements"></textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default VocabularyBasedTexts;
