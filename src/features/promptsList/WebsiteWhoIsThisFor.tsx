import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const LandingPageWhoIsThisFor = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        topicLandingPage: '',
        audience: '',
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I want to create a Who is this for section on my website.
    List 6 types of people I can list there.
    Generate 3 outputs each with 6 types of people: In 1st output, only list them and in 2nd output, list them and add a brief description of what my training can help them with in under 140 characters and in 3rd output, list them and add 3 short benefits for each in bullets for them after doing the training in 5-6 words. Give headings on the output as 'List without description', 'List with description' and 'List with 3 Benefits'. Don't give me a summary or an intro. Topic is ${formData.topicLandingPage}. Audience is ${formData.audience}.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Website: Who is this for</h2>
            <h3>Generate Content for ‘Who is this for’ section on website or landing page.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topicLandingPage"> Topic of the Landing Page <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topicLandingPage"
                        onChange={handleInputChange}
                        value={formData.topicLandingPage}
                        placeholder="Eg. Become a Chess Pro: Learn Strategies from the Masters"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audience"> Audience <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Students"
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default LandingPageWhoIsThisFor;