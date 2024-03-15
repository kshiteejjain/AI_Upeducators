import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const TextURLToQuestions = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        textInputUrl: '',
        questionType: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 ${formData.questionType} questions based on the following text or link: ${formData.textInputUrl}. 
    The questions should be relevant to the key themes and ideas in the text or URL 
    `;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Text URL To Questions</h2>
            <h3>Generate questions based on text or web page/URL.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='textInputUrl'> Text Input / URL
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='textInputUrl'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.textInputUrl}
                        placeholder='Paste the text / URL you want to analyse.'>
                    </textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="questionType"> Question Type
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="questionType"
                        onChange={handleInputChange}
                        value={formData.questionType}
                        placeholder="e.g., Multiple Choice, Fill in the blanks, True/False, Comprehension, Open-Ended"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default TextURLToQuestions;
