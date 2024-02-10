import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextTranslatorGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        originalText: '',
        targetLanguage: 'English',
        contextOrDomain: '',
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
    const promptMessage = `Translate the following text to ${formData.targetLanguage}: "${formData.originalText}". The text is related to ${formData.contextOrDomain}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Text Translator Generator</h2>
            <h3>This tool translates text from one language to another while maintaining the original meaning.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='originalText'> Original Text <span className='asterisk'>*</span> </label>
                    <textarea required className='form-control' name='originalText' onChange={handleInputChange} rows={5} value={formData.originalText} placeholder='Enter the text you want to translate.'></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='targetLanguage'> Target Language <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="targetLanguage" onChange={handleInputChange} value={formData.targetLanguage}>
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Mandarin">Mandarin</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Arabic">Arabic</option>
                        <option value="Russian">Russian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Italian">Italian</option>
                        {/* Add other languages as needed */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='contextOrDomain'> Context or Domain</label>
                    <input className='form-control' name='contextOrDomain' onChange={handleInputChange} value={formData.contextOrDomain} placeholder='Describe the context or domain of the text (e.g., education, technical, business, casual).' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'> Target Audience <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Write the specified audience (e.g., class 11 students).' />
                </div>
                <Button title='Translate' type="submit" />
            </form>
        </div>
    )
};
export default TextTranslatorGenerator;
