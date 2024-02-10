import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextExpander = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        text: '',
        wordLimit: '',
        tone: 'Professional'
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Take the following text and expand on it. It may be necessary to recreate the text in a more comprehensive manner.
            Text is ${formData.text}. Word limit is ${formData.wordLimit} words. Tone: ${formData.tone}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Text Expander</h2>
            <h3>Quickly generate more detailed and comprehensive content with ease.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='text'>Text<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='text'
                        onChange={handleInputChange}
                        value={formData.text}
                        placeholder='Enter the Text you want to Expand'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='wordLimit'>Word limit</label>
                    <input
                        type='number'
                        className='form-control'
                        name='wordLimit'
                        onChange={handleInputChange}
                        value={formData.wordLimit}
                        placeholder='Enter the number of words you want'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='tone'>Tone</label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.tone}>
                        <option value="Professional">Professional</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Informative">Informative</option>
                        <option value="Persuasive">Persuasive</option>
                        <option value="Casual">Casual</option>
                        <option value="Inspirational">Inspirational</option>
                        <option value="Authoritative">Authoritative</option>
                        <option value="Playful">Playful</option>
                        <option value="Educational">Educational</option>
                    </select>
                </div>
                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default TextExpander;
