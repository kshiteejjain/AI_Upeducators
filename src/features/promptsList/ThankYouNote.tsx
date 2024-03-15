import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ThankYouNote = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        relationship: '',
        reason: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a customized thank you note for my ${formData.relationship} for ${formData.reason}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Thank You Note Generator</h2>
            <h3>Create a personalized Thank You Note for various occasions.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="relationship"> Relationship
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="relationship"
                        onChange={handleInputChange}
                        value={formData.relationship}
                        placeholder="e.g., Family Member, Friend, Colleague, Teacher, Mentor"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reason"> Reason
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="reason"
                        onChange={handleInputChange}
                        value={formData.reason}
                        placeholder="e.g., birthday gift, farewell, support during a project"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default ThankYouNote;
