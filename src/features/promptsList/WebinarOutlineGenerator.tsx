import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WebinarOutlineGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        webinarTitle: '',
        audience: '',
        duration: 'Seconds',
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a focused outline for a webinar titled "${formData.webinarTitle}" targeting ${formData.audience}. The webinar will be ${formData.duration} long.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Webinar Outline Generator</h2>
            <h3>Generate a structured outline for your webinar, focusing on the title and audience</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='webinarTitle'>Webinar Title <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='webinarTitle' onChange={handleInputChange} value={formData.webinarTitle} placeholder='Enter the title of your webinar (e.g., "Careers after 12th")' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify your target audience, e.g., College Students, Fitness Enthusiasts, Gaming Fans.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="seconds"> Seconds</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default WebinarOutlineGenerator;