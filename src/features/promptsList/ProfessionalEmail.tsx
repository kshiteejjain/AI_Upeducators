import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ProfessionalEmail = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        purposeOfEmail: '',
        relationshipWithReceiver: '',
        keyPointsToInclude: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a professional email tailored to ${formData.relationshipWithReceiver}.The email should serve the purpose of ${formData.purposeOfEmail} and include the following key points: ${formData.keyPointsToInclude}. The email should be concise, clear, and respectful, ensuring effective communication.
    `;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Professional Email</h2>
            <h3>Generate emails for communication.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="purposeOfEmail"> Purpose of Email <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="purposeOfEmail"
                        onChange={handleInputChange}
                        value={formData.purposeOfEmail}
                        placeholder="e.g., Meeting Request, Project Update, Feedback Request, General Inquiry"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="relationshipWithReceiver"> Relationship with the Receiver <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="relationshipWithReceiver"
                        onChange={handleInputChange}
                        value={formData.relationshipWithReceiver}
                        placeholder="e.g., Principal, HR Department, Student, Colleague, Parents"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="keyPointsToInclude"> Key Points to Include <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="keyPointsToInclude"
                        onChange={handleInputChange}
                        value={formData.keyPointsToInclude}
                        rows={5}
                        placeholder="e.g., any specific information, deadlines, attachments, meeting details"
                    >
                    </textarea>
                </div>

                <Button title="Generate" type="submit" />
            </form>
        </div>
    );
};
export default ProfessionalEmail;
