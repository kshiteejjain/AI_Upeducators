import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookReelsTitleIdeaGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        number: '',
        audience: '',
        interestArea: '',
        duration: 'seconds',
        purpose: 'educational'
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate ${formData.number} creative title ideas for Facebook Reels aimed at ${formData.audience} with an interest in ${formData.interestArea}. The title should suit a ${formData.duration} long reel and be [purpose] in nature, engaging the audience effectively.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook Reels Title Idea Generator</h2>
            <h3>Generate creative and engaging title ideas for Facebook Reels, tailored to your specific audience and goals.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='number'>Number</label>
                    <input className='form-control' name='number' onChange={handleInputChange} value={formData.number} placeholder='Specify how many reel ideas you want to generate.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify the target audience, e.g., Young Adults, Parents, Fitness Enthusiasts, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='interestArea'>Interest Area</label>
                    <input required className='form-control' name='interestArea' onChange={handleInputChange} value={formData.interestArea} placeholder='Mention a broad area of interest related to your audience, like Technology, Health & Wellness, Education, Entertainment.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="seconds"> Seconds</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='purpose'> Purpose</label>
                    <select className='form-control' name="purpose" onChange={handleInputChange} value={formData.purpose}>
                        <option value="educational">Educational</option>
                        <option value="promotional">Promotional</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="inspirational">Inspirational</option>
                    </select>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FacebookReelsTitleIdeaGenerator;