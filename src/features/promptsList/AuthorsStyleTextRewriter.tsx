import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const AuthorsStyleRewriter = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        author: '',
        originalText: '',
        lengthRewrittenText: '',
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
    const promptMessage = `Rewrite the following text in the style of ${formData.author}: 
    ${formData.originalText}.
    The re-written text should be appropriate for ${formData.gradeLevel} students and ${formData.lengthRewrittenText} in length.
    Also consider these additional details: ${formData.additionalDetails}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Author's Style Text Rewriter</h2>
            <h3>Rewrite a given text to match the writing style of a specific author.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level to ensure the rewritten text is age-appropriate.">
                        <option value="">Select the grade level</option>
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

                <div className='form-group'>
                    <label htmlFor='author'>Author
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="author"
                        onChange={handleInputChange}
                        value={formData.author}
                        placeholder="e.g., William Shakespeare, Jane Austen, Mark Twain, J.K. Rowling, Ernest Hemingway" />
                </div>

                <div className='form-group'>
                    <label htmlFor='originalText'>Original Text
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name="originalText"
                        onChange={handleInputChange}
                        value={formData.originalText}
                        rows={5}
                        placeholder="Enter the text you want to be rewritten in the author's style.">
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='lengthRewrittenText'>Length of Rewritten Text
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="lengthRewrittenText"
                        onChange={handleInputChange}
                        value={formData.lengthRewrittenText}
                        placeholder="Choose the length of the rewritten text.">
                        <option value="Original Word Count">Original Word Count</option>
                        <option value="Shorten by 25%">Shorten by 25%</option>
                        <option value="Shorten by 50%">Shorten by 50%</option>
                        <option value="Extend by 25%">Extend by 25%</option>
                        <option value="Extend by 50%">Extend by 50%</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <input
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder={`For Example-Tone (e.g., Formal, Informal, Humorous, Serious, Satirical) \nContent Type (e.g., Textbook Page, Play Script, Speech) \nVocabulary Level (e.g., Basic, Intermediate, Advanced) \nAny other additional details`} />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default AuthorsStyleRewriter;
