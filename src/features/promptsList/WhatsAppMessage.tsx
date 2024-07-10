import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WhatsAppMessage = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        instituteName: '',
        targetAudience: '',
        purpose: '',
        courseEventName: '',
        additionalDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a comprehensive WhatsApp message for institute name ${formData.instituteName}. Targeting is ${formData.targetAudience}. Purpose of the message is ${formData.purpose}. 1st add a short and attractive Headline and add user name like Hello Name or Dear Name.
    Make engaging or interesting points in start so that they view full message. Include Course/Event Name as ${formData.courseEventName} and add Date and Time and 3 benefits in short point format. The message should have a compelling call to action. Add an Urgency Element to create immediacy and include Additional Details: ${formData.additionalDetails} if necessary in engaging and seamless way without adding 'Additional Details' heading. Ensure the message is concise, in short points. Add emojis to make it engaging. Add * for Bold text,  and _ for italic text in start and end of that text you want to highlight wherever necessary.
    Frame message in such a way that it looks engaging and encourages reader to take action.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>WhatsApp Message</h2>
            <h3>Crafting whatsapp messages for courses and events.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="instituteName">Institute Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="instituteName"
                        onChange={handleInputChange}
                        value={formData.instituteName}
                        placeholder="Eg. Knowledge Academy, Megha classes"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAudience">Target Audience</label>
                    <input
                        type="text"
                        className="form-control"
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={formData.targetAudience}
                        placeholder="Eg. Parents, students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="purpose">Purpose<span className="asterisk">*</span></label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        name="purpose"
                        onChange={handleInputChange}
                        value={formData.purpose}
                        placeholder="Eg. Course Promotion, Batch launch, Event"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="courseEventName">Course/Event Name<span className="asterisk">*</span></label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        name="courseEventName"
                        onChange={handleInputChange}
                        value={formData.courseEventName}
                        placeholder="Eg. Yoga classes for kids, Webinar on public speaking"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <input
                        type="text"
                        className="form-control"
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="Add Highlights/other details relevant to the message."
                    />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WhatsAppMessage;