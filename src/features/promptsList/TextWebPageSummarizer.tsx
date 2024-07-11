import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextWebPageSummarizer = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    
    const getInitialFormData = () => ({
        textURLToSummarize: '',
        summaryLength: '',
        otherSummaryLength: '', // New state for handling 'Other' summary length
        outputType: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Update formData based on input type
        if (name === 'summaryLength' && value === 'Other') {
            setFormData((prevData) => ({
                ...prevData,
                summaryLength: value,
                otherSummaryLength: '', // Reset other summary length input when selecting 'Other'
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const promptMessage = `Generate a ${formData.outputType} summary of the following text or link: ${formData.textURLToSummarize}. The summary should be approximately ${
        formData.summaryLength === 'Other' ? formData.otherSummaryLength : formData.summaryLength
    } in length.`;

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
                    <label htmlFor="textURLToSummarize"> Text / URL to Summarize<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="textURLToSummarize"
                        onChange={handleInputChange}
                        value={formData.textURLToSummarize}
                        rows={5}
                        placeholder="Paste the text or URL you want to summarize."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="summaryLength"> Summary Length<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="summaryLength"
                        onChange={handleInputChange}
                        value={formData.summaryLength}
                    >
                        <option value="">Select One</option>
                        <option value="Short">Short (50-100 words)</option>
                        <option value="Medium">Medium (100-150 words)</option>
                        <option value="Long">Long (150-200 words)</option>
                        <option value="Very Long">Very Long (200-250 words)</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {formData.summaryLength === 'Other' && (
                        <div className='form-group'>
                        <label htmlFor='otherQuestionType'>Other<span className="asterisk">*</span></label>
                        <input
                            className="form-control"
                            name="otherSummaryLength"
                            onChange={handleInputChange}
                            value={formData.otherSummaryLength}
                            placeholder="Specify other summary length"
                        />
                    </div>
                    )}

                <div className="form-group">
                    <label htmlFor="outputType"> Output Type </label>
                    <select
                        required
                        className='form-control'
                        name="outputType"
                        onChange={handleInputChange}
                        value={formData.outputType}
                    >
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
