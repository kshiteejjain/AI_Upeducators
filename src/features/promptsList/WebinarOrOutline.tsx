import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WebinarOutline = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        webinarTitle: '',
        audience: '',
        duration: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Craft a compelling and dynamic ${formData.duration} webinar outline for ${formData.webinarTitle}, strategically tailored to captivate and engage ${formData.audience}. Ensure the content is not only informative but also enthralling, keeping the audience hooked from start to finish. Integrate strategic points throughout the outline to seamlessly transition into a persuasive call-to-action for the course you're promoting at the end. Make every minute count, making the entire webinar an irresistible journey that leaves attendees eagerly signing up for the course you're showcasing.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Webinar Outline</h2>
            <h3>Generate a structured outline for webinar or seminar, focusing on the title and audience</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="webinarTitle"> Webinar Title<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="webinarTitle"
                        onChange={handleInputChange}
                        value={formData.webinarTitle}
                        placeholder="Eg. Careers after 12th"
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
                        placeholder="Eg. 12th grade passed students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="duration"> Duration<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="duration"
                        onChange={handleInputChange}
                        value={formData.duration}
                        placeholder="Eg. 1 hour, 90 minutes, 30 minutes"
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WebinarOutline;