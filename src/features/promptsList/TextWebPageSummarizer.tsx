import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextWebPageSummarizer = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        textURLToSummarize:'',
        summaryLength: '',
        outputType: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a ${formData.outputType} summary of the following text or link: ${formData.textURLToSummarize}. It should be generated according to ${formData.gradeLevel} Standards. The summary should be approximately ${formData.summaryLength} in length.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Text / Web Page Summarizer</h2>
            <h3>Summarize any text or web page in a concise format. </h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className="asterisk">*</span></label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel} placeholder="Select the grade level of your students.">
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
                    <label htmlFor="textURLToSummarize"> Text / URL to Summarize <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="textURLToSummarize"
                        onChange={handleInputChange}
                        value={formData.textURLToSummarize}
                        rows={5}
                        placeholder="Paste the text or URL you want to summarize."
                    >
                    </textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="summaryLength"> Summary Length </label>
                    <input
                        className="form-control"
                        name="summaryLength"
                        onChange={handleInputChange}
                        value={formData.summaryLength}
                        placeholder="e.g., 100 words, 150 words, 200 words"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="outputType"> Output Type </label>
                    <input
                        className="form-control"
                        name="outputType"
                        onChange={handleInputChange}
                        value={formData.outputType}
                        placeholder="e.g. Paragraph, Points-wise"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default TextWebPageSummarizer;
