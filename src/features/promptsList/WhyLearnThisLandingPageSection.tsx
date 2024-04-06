import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const WhyLearnThisLandingPageSection = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        topicOfTheLandingPage: '',
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
    const promptMessage = `Topic is ${formData.topicOfTheLandingPage}. Audience is ${formData.audience}.
    Create a 'Why learn this' section for landing page with 8 points.
    Generate 2 outputs: 1 output without description and 1 output with description less than 140 characters in each point. Give headings on the output as 'List without description' and 'List with description'`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Why Learn This: Landing Page Section</h2>
            <h3>Generate Content for ‘Why learn this’ section on your landing page.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topicOfTheLandingPage">Topic of the Landing Page<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topicOfTheLandingPage"
                        onChange={handleInputChange}
                        value={formData.topicOfTheLandingPage}
                        placeholder="Eg. Become a Chess Pro: Learn Strategies from the Masters"
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
                        placeholder="Eg. Students, Parents."
                    />
                </div>
                <Button title="Generate" type="submit" />
            </form>
        </div>
    );
};
export default WhyLearnThisLandingPageSection;
