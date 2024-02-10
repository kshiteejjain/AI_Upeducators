import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextSummaryGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        textContent: '',
        summaryLength: 'Short',
        keyPoints: '',
        purposeOfSummary: '',
        targetAudience: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a summary for the text "${formData.textContent}". The summary should be ${formData.summaryLength.toLowerCase()}, focusing on key points such as ${formData.keyPoints}. The summary is intended for ${formData.purposeOfSummary} for ${formData.targetAudience}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Text Summary Generator</h2>
            <h3>This form is designed to assist in creating concise and accurate summaries of provided text materials.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='textContent'> Text Content <span className='asterisk'>*</span> </label>
                    <textarea required className='form-control' name='textContent' onChange={handleInputChange} rows={5} value={formData.textContent} placeholder='Paste the text you want to summarize here.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='summaryLength'> Summary Length <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="summaryLength" onChange={handleInputChange} value={formData.summaryLength}>
                        <option value="Short">Short (1-2 sentences)</option>
                        <option value="Medium">Medium (1 paragraph)</option>
                        <option value="Long">Long (2-3 paragraphs)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyPoints'> Key Points to Highlight </label>
                    <textarea className='form-control' name='keyPoints' onChange={handleInputChange} rows={5} value={formData.keyPoints} placeholder='Mention any specific points, themes, or aspects that should be emphasized in the summary.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='purposeOfSummary'> Purpose of Summary </label>
                    <input className='form-control' name='purposeOfSummary' onChange={handleInputChange} value={formData.purposeOfSummary} placeholder='Specify the purpose of the summary (e.g., academic review, general understanding, presentation).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'> Target Audience </label>
                    <input className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the audience (e.g., class 9th students, Educators).' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default TextSummaryGenerator;
