import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SocialMediaCalendarGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        themesTopics: '',
        audience: '',
        platform: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a social media calendar for 15 days for ${formData.platform} in a table. My audience is ${formData.audience}. Theme is ${formData.themesTopics}. Content ideas should be engaging so that posts get more likes, comments, saves and shares and also promote follows and should cover all popular formats mentioning the format. Table should have Serial number, Content idea and Format.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Social Media Calendar</h2>
            <h3>Generate a daily social media posting calendar.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="audience"> Audience <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. students, parents, or educators."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="themesTopics"> Themes/Topics </label>
                    <input
                        className="form-control"
                        name="themesTopics"
                        onChange={handleInputChange}
                        value={formData.themesTopics}
                        placeholder="Eg. yoga tips for kids, teaching tips"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="platform"> Platform
                        <span className="asterisk">*</span>
                    </label>
                    <select
                        required
                        className="form-control"
                        name="platform"
                        onChange={handleInputChange}
                        value={formData.platform}
                    >
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Pinterest">Pinterest</option>
                        <option value="YouTube">YouTube</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default SocialMediaCalendarGenerator;
