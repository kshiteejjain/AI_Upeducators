import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WebinarTitle = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        topic: '',
        audience: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 engaging webinar titles for a topic on ${formData.topic} aimed at ${formData.audience}. The titles should be catchy and appealing to grab the audience's attention`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Webinar Title</h2>
            <h3>Generate innovative titles for your Webinars or Seminars</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topic"> Topic<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="Eg. Careers after 12th, Technology Trends."
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="audience"> Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. College Students, Fitness Enthusiasts, Gaming Fans."
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WebinarTitle;