import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ProofreadText = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        originalText: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Proofread the following text: ${formData.originalText}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Proofread Text</h2>
            <h3>Proofread your text to correct grammar, spelling, punctuation, etc.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="originalText"> Original Text<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="originalText"
                        onChange={handleInputChange}
                        value={formData.originalText}
                        rows={5}
                        placeholder="e.g., any written content, essay, article, email"
                    >
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ProofreadText;
