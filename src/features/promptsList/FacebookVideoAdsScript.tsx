import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookVideoAdsScript = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        service: '',
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
    const promptMessage = `For a Facebook ad in reel or video format, kickstart with an attention-grabbing intro for ${formData.service} to ${formData.audience}. Craft a compelling opening that sets the tone. Create engaging segments within the video that showcase various facets or benefits of [service/skill]. Ensure each segment tells a concise story, resonates with the audience's interests, and ends with a clear call-to-action.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook Video Ads Script</h2>
            <h3>Create dynamic and visually appealing content for Facebook video.reel ad, tailored to captivate your audience and drive interaction.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='service'>Service/Skill <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='service' onChange={handleInputChange} value={formData.service} placeholder='Write your service/skill name and describe briefly' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required name="audience" className='form-control' onChange={handleInputChange} value={formData.audience} placeholder='Identify the target audience for your ad, such as Teenagers, College Students.' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FacebookVideoAdsScript;