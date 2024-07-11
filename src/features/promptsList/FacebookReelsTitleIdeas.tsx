import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookReelsTitleIdeas = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        audience: '',
        topicInterestArea: '',
        duration: '',
        reelPurpose: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 creative title ideas for Facebook Reels aimed at ${formData.audience} with an interest in ${formData.topicInterestArea}. The title should suit a ${formData.duration} long reel and be ${formData.reelPurpose} in nature, engaging the audience effectively.    `
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook Reels Title Ideas</h2>
            <h3>Generate creative title ideas for Reels.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="audience"> Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Young Adults, Parents, Fitness Enthusiasts"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="topicInterestArea"> Topic/Interest Area<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topicInterestArea"
                        onChange={handleInputChange}
                        value={formData.topicInterestArea}
                        placeholder="Eg. yoga classes for kids, Build a successful career."
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
                        placeholder="30 seconds, 1 minute"
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='reelPurpose'> Reel Purpose </label>
                    <input
                        className='form-control'
                        name='reelPurpose'
                        onChange={handleInputChange}
                        value={formData.reelPurpose}
                        placeholder='Educational, Promotional, Entertainment, Inspirational'
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FacebookReelsTitleIdeas;