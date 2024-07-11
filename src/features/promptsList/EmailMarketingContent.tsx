import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EmailContentGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        emailSubject: '',
        emailPurpose: '',
        audience: '',
        keyMessage: '',
        productService: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create an impactful email with Email Subject: ${formData.emailSubject}. Audience is ${formData.audience}. The email should be engaging, clear, and aligned with the desired action if needed. Email should serve the purpose of ${formData.emailPurpose}. Ensure the email encompasses the key message '${formData.keyMessage}’`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Email Marketing Content</h2>
            <h3>Create engaging marketing email content</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="emailSubject">Email Subject
<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="emailSubject"
                        onChange={handleInputChange}
                        value={formData.emailSubject}
                        placeholder="Eg. Expert Tips for Children's Online Behavior"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audience">Audience</label>
                    <input
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Parents, Teenagers"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="emailPurpose">Email Purpose</label>
                    <input
                        className="form-control"
                        name="emailPurpose"
                        onChange={handleInputChange}
                        value={formData.emailPurpose}
                        placeholder="Eg. Informational, Marketing, Introduction"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="keyMessage">Key message</label>
                    <textarea
                        className="form-control"
                        name="keyMessage"
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.keyMessage}
                        placeholder="Mention features, offer, benefit, highlights">
                    </textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EmailContentGenerator;