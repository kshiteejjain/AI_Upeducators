import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdsTargeting = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        courseSkillName: '',
        audience: '',
        location: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a list of specific job titles, roles and other areas available in Behaviour, Interest, Education, Job Title and other areas you feel necessary for my ad that can be targeted and available in Facebook Ads for promoting ${formData.courseSkillName} in ${formData.location}. The targeting should focus on ${formData.audience}. Targeting should be detailed and specific. The list should be detailed and tailored to effectively reach the intended audience for the course or product being advertised. Also give other details like Age, Location ideas and other ideas that are necessary. Don't add introductory paragraph. Only provide to-the-point output.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook Ads Targeting</h2>
            <h3>Create a targeting strategy for Facebook ads to promote courses effectively</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseSkillName">Course/Skill Name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="courseSkillName"
                        onChange={handleInputChange}
                        value={formData.courseSkillName}
                        placeholder="Eg. Yoga classes for kids, Maths tuition for class 6th"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audience">Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Parents, Teenagers"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="location"
                        onChange={handleInputChange}
                        value={formData.location}
                        placeholder="Eg. India, Mumbai, Delhi, Rajasthan"
                    />
                </div>

                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default FacebookAdsTargeting;
