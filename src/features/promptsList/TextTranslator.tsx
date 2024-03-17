import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextTranslatorGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        text: '',
        targetLanguage: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Translate the text "${formData.text}" to ${formData.targetLanguage}. The translation should be accurate and capture the essence of the original text.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Text Translator</h2>
            <h3>Translate any text into your desired language.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='text'> Text
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='text'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.text}
                        placeholder='Enter the text you want to translate'>
                    </textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="targetLanguage"> Target Language
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="targetLanguage"
                        onChange={handleInputChange}
                        value={formData.targetLanguage}
                        placeholder="Enter the language you want to translate the text into."
                    />
                </div>

                <Button title='Translate' type="submit" />
            </form>
        </div>
    )
};
export default TextTranslatorGenerator;
