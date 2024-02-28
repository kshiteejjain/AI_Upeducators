import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ProfessionalEmailGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        recipientName: '',
        recipientPosition: '',
        senderName: '',
        subjectLine: '',
        purposeOfEmail: '',
        toneAndStyle: 'Formal',
        lengthAndDetail: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Compose a professional email addressed to ${formData.recipientName}, ${formData.recipientPosition}, from ${formData.senderName}. The subject line should read "${formData.subjectLine}," and the email's purpose is ${formData.purposeOfEmail}. The tone and style should be ${formData.toneAndStyle}, and the email should be ${formData.lengthAndDetail}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Professional Email Generator</h2>
            <h3>Create professional emails tailored to specific needs and contexts.</h3>
            <form onSubmit={handleSubmit}>
                {/* Recipient Information */}
                <div className="form-group">
                    <label htmlFor="recipientName">Recipient's Name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="recipientName"
                        onChange={handleInputChange}
                        value={formData.recipientName}
                        placeholder="Enter the full name of the email recipient"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="recipientPosition">Recipient's Position or Title</label>
                    <input
                        className="form-control"
                        name="recipientPosition"
                        onChange={handleInputChange}
                        value={formData.recipientPosition}
                        placeholder="Enter the position or title of the recipient if relevant"
                    />
                </div>
                {/* Sender Information */}
                <div className="form-group">
                    <label htmlFor="senderName">Sender's Name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="senderName"
                        onChange={handleInputChange}
                        value={formData.senderName}
                        placeholder="Enter your full name or the name of the person sending the email"
                    />
                </div>
                {/* Email Subject */}
                <div className="form-group">
                    <label htmlFor="subjectLine">Subject Line<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="subjectLine"
                        onChange={handleInputChange}
                        value={formData.subjectLine}
                        placeholder="Enter a concise and clear subject line for the email"
                    />
                </div>
                {/* Email Purpose */}
                <div className="form-group">
                    <label htmlFor="purposeOfEmail">Purpose of Email<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="purposeOfEmail"
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.purposeOfEmail}
                        placeholder="Briefly describe the main purpose or objective of the email"
                    />
                </div>
                {/* Tone and Style */}
                <div className="form-group">
                    <label htmlFor="toneAndStyle">Tone and Style</label>
                    <select
                        className="form-control"
                        name="toneAndStyle"
                        onChange={handleInputChange}
                        value={formData.toneAndStyle}
                    >
                        <option value="Formal">Formal</option>
                        <option value="Informal">Informal</option>
                        <option value="Friendly">Friendly</option>
                        <option value="Assertive">Assertive</option>
                        <option value="Sympathetic">Sympathetic</option>
                        <option value="Convincing">Convincing</option>
                        <option value="Polite">Polite</option>
                        <option value="Requesting">Requesting</option>
                    </select>
                </div>
                {/* Length and Detail */}
                <div className="form-group">
                    <label htmlFor="lengthAndDetail">Length and Detail</label>
                    <input
                        className="form-control"
                        name="lengthAndDetail"
                        onChange={handleInputChange}
                        value={formData.lengthAndDetail}
                        placeholder="Specify the desired length and level of detail for the email"
                    />
                </div>
                <Button title="Generate" type="submit" />
            </form>
        </div>
    );
};
export default ProfessionalEmailGenerator;
