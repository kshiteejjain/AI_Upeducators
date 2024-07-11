import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdsReelsScript = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        courseSkillName: '',
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
    const promptMessage = `For a Facebook ad in Reel, kickstart with an attention-grabbing intro for ${formData.courseSkillName} to ${formData.audience}. Craft a compelling opening that sets the tone. Create engaging segments within the Reel that showcase various facets or benefits. Ensure each segment tells a concise story, resonates with the audience's interests, and ends with a clear call-to-action.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook ads: Reels Script</h2>
            <h3>Create content for Facebook ad reels</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseSkillName"> Course/Skill Name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="courseSkillName"
                        onChange={handleInputChange}
                        value={formData.courseSkillName}
                        placeholder="Eg. dance classes for kids"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="audience"> Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Parents, Teenagers, College Students."
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FacebookAdsReelsScript;