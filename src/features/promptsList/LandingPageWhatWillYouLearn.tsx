import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const LandingPageWhatWillYouLearn = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        topicOfLandingPage: '',
        audience: '',
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `List 12 different points that I can add to the "What you will learn" section. It should persuade people to want to learn it.
    Each point should seem logical and represent a module in the customer learning journey
    Give me the list without an intro or summary.
    Generate 2 outputs: 1 output without a description and 1 output with a description in each point less than 150 characters long.
    Make it persuasive and use powerful words while describing what they will learn from me, make it quantifiable if possible.
    Give some a powerful formula name to make it look like I have a unique method. Topic is ${formData.topicOfLandingPage}. Audience is ${formData.audience}.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Landing Page: What will you learn</h2>
            <h3>Generate Content for ‘What will you learn’ section on your landing page.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topicOfLandingPage"> Topic of the Landing Page
                        <span className="asterisk">*</span>
                    </label>
                    <input
                        required
                        className="form-control"
                        name="topicOfLandingPage"
                        onChange={handleInputChange}
                        value={formData.topicOfLandingPage}
                        placeholder="yoga classes for kids, dance classes for kids"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="audience"> Audience
                        <span className="asterisk">*</span>
                    </label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="students, parents"
                    />
                </div>



                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default LandingPageWhatWillYouLearn;