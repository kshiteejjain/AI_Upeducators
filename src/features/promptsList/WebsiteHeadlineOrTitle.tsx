import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
const CourseLandingPageTitle = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        topic: '',
        pageObjective: '',
        targetAudience: '',
        keyBenefit: ''
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 main headline and sub-headline for a landing page with the following details:
    Topic: ${formData.topic}
    Page Objective: ${formData.pageObjective}
    Target Audience: ${formData.targetAudience}
    Key Benefit: ${formData.keyBenefit}
    Each main headline should be of 6-8 words and the sub-headline should be of 11-14 words.`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Website Headline or Title</h2>
            <h3>Generate Main Headline and Sub-headline for your website or Landing page.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topic"> Topic<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="Eg. Webinar on necessity of dance for kids"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="pageObjective"> Page Objective<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="pageObjective"
                        onChange={handleInputChange}
                        value={formData.pageObjective}
                        placeholder="Eg. Webinar registration, Lead generation, Event registration"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAudience"> Target Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={formData.targetAudience}
                        placeholder="Eg. Parents, students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="keyBenefit"> Key Benefit </label>
                    <input
                        className="form-control"
                        name="keyBenefit"
                        onChange={handleInputChange}
                        value={formData.keyBenefit}
                        placeholder="Eg. Learn from Dance expert, become a professional dancer"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default CourseLandingPageTitle;