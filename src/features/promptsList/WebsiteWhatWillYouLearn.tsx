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
        duration: ''
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `List 12 different points that I can add to the "What you will learn" section. It should persuade people to want to learn it.
    Each point should seem logical and represent the topic.
    Give me the list without an intro or summary.
    Generate 2 list of outputs with 12-12 points: 1 output without a description and 1 output with heading and description in each point less than 150 characters long and give respective headings for both the outputs.
    Make it persuasive and use powerful words while describing what they will learn from me, make it quantifiable if possible.
    Give a powerful formula name in some points to make it look like I have a unique method. Topic is ${formData.topicOfLandingPage}. Audience is ${formData.audience}. Duration is ${formData.duration}.`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Website: What Will You Learn</h2>
            <h3>Generate Content for ‘What will you learn’ section on your website or landing page.</h3>
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
                        placeholder="Eg. yoga classes for kids, webinar on necessity of dance for kids"
                    />
                </div>

                <div className="form-group">
    <label htmlFor="duration"> Duration </label>
    <input
      className="form-control"
      name="duration"
      onChange={handleInputChange}
      value={formData.duration}
      placeholder="Eg. 30 minutes, 1 hour, 90 minutes"
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