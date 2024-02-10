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
        topic: '',
        tone: 'Formal',
        urgency: 'Include',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate an engaging email title for ${formData.audience} about ${formData.topic}. The title should have a ${formData.tone} tone and ${formData.urgency} a sense of urgency, aiming to capture attention and encourage email opening.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Email Title Generator</h2>
            <h3>Generate captivating and effective email titles suitable for various topics and audiences.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Enter the target audience, e.g., Teachers, Students, Parents, Business Professionals.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder=' Specify the email"s main topic or subject, like "Online Learning Tools" or "Educational Discounts".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='tone'>Tone <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="tone" onChange={handleInputChange} value={formData.tone}>
                        <option value="Formal">Formal</option>
                        <option value="Informal">Informal</option>
                        <option value="Promotional">Promotional</option>
                        <option value="Informative">Informative</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Inspirational">Inspirational</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='urgency'> Urgency <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="urgency" onChange={handleInputChange} value={formData.urgency}>
                        <option value="Include">Include </option>
                        <option value="Exclude">Exclude </option>
                    </select>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EmailTitleGenerator;