import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EmailResponse = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        receivedEmail: '',
        keyPointsToIncludeInReply: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a professional email response to address this email “${formData.receivedEmail}” and follow the outlined response: ${formData.keyPointsToIncludeInReply}. `;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Email Response</h2>
            <h3>Create an email response based on the email you received.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="receivedEmail"> Received Email <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="receivedEmail"
                        onChange={handleInputChange}
                        value={formData.receivedEmail}
                        rows={5}
                        placeholder="Paste the email you received."
                    >
                    </textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="keyPointsToIncludeInReply"> Key Points to Include in Reply <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="keyPointsToIncludeInReply"
                        onChange={handleInputChange}
                        value={formData.keyPointsToIncludeInReply}
                        rows={5}
                        placeholder="Any information or specific details you want to include"
                    >
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default EmailResponse;
