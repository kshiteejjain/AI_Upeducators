import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const PersonalStyleTextRewriter = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        originalText: '',
        yourWritingStyle: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Rewrite the following text in this personal writing style: ${formData.yourWritingStyle}.
    Text to be Re-written- "${formData.originalText}”`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Personal Style Text Rewriter</h2>
            <h3>Rewrite a given text in your style of writing.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="originalText">Original Text<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="originalText"
                        onChange={handleInputChange}
                        value={formData.originalText}
                        placeholder="Enter the text you want to be rewritten in your style."
                        rows={5}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="yourWritingStyle">Your Writing Style<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="yourWritingStyle"
                        onChange={handleInputChange}
                        value={formData.yourWritingStyle}
                        placeholder="Paste text in your writing style"
                        rows={5}
                    ></textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default PersonalStyleTextRewriter;
