import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WhatsAppMessageGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        instituteName: '',
        targetAudience: '',
        courseName: '',
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
    const promptMessage = `Generate a comprehensive WhatsApp message for institute name ${formData.instituteName}. Targeting is ${formData.targetAudience}. 1st add a short and attractive Headline and add user name like Hello Name or Dear Name.
            Make engaging or interesting points in start so that they view full message. Include 
            Course/Event Name as ${formData.courseName} and add Date and Time and 3 benefits in short point format. The message should have a compelling call to action. Add an Urgency Element to create immediacy and include Additional Details: [Additional details] if necessary in engaging way. Ensure the message is concise, in short points. Add emojis to make it engaging. Add * for Bold text,  and _ for italic text in start and end of that text you want to highlight wherever necessary.
            Frame message in such a way that it looks engaging and encourages reader to take action.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>WhatsApp Message Generator</h2>
            <h3>Crafting captivating messages for courses and events to engage and entice participants effortlessly.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='instituteName'>Institute Name</label>
                    <input className='form-control' name='instituteName' onChange={handleInputChange} value={formData.instituteName} placeholder='Enter the name of your educational institute. This will add credibility and recognition to your message.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience</label>
                    <input name="targetAudience" className='form-control' onChange={handleInputChange} value={formData.targetAudience} placeholder='Enter the target audience for the message. Tailor your message to their specific interests and needs.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseName'>Course/Event Name <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseName' onChange={handleInputChange} value={formData.courseName} placeholder='Enter the name of the course or event you are promoting, if applicable.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <input className='form-control' name='additionalDetails' onChange={handleInputChange} value={formData.additionalDetails} placeholder='Include any Highlights or benefits or extra information or details that might be relevant or beneficial to the message.' />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WhatsAppMessageGenerator;