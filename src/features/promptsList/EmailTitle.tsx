import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EmailTitleGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        audience: '',
        topic: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 engaging email titles for ${formData.audience}. Generate titles for the topic: ${formData.topic}. The title should aim to capture attention and encourage email opening and should have its meaning and not exact words. 5 email titles should have urgency and 5 email titles should not have urgency. Give headings in both the types of titles: Email Titles with urgency and Email Titles without urgency.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Email Title</h2>
            <h3>Generate attractive Email titles for your Emails.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="audience">Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Students, Parents, Business Professionals."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="topic">Topic<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="Eg. Tips for Children's Online Behavior."
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EmailTitleGenerator;