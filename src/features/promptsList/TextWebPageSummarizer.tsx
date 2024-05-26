import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextWebPageSummarizer = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
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
    const promptMessage = `Generate a ${formData.outputType} summary of the following text or link: ${formData.textURLToSummarize}  
    The summary should be approximately ${formData.summaryLength} in length.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Text / Web Page Summarizer</h2>
            <h3>Summarize any text or web page in a concise format. </h3>
            <form onSubmit={handleSubmit}>
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
                    <select
                        required
                        className='form-control'
                        name="textLength"
                        onChange={handleInputChange}
                        value={formData.outputType}>
                        <option value="">Select One</option>
                        <option value="Paragraph-style">Paragraph-style</option>
                        <option value="Bullet point">Bullet point</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default TextWebPageSummarizer;
