import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const HashtagGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        postTopic: '',
        targetAudience: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 15 popular hashtags for a post about ${formData.postTopic} targeting ${formData.targetAudience}. Ensure the hashtags are relevant and likely to attract the intended audience.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Hashtag Generator</h2>
            <h3> Generate hashtags for your Social Media posts.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="postTopic">Post Topic<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="postTopic"
                        onChange={handleInputChange}
                        value={formData.postTopic}
                        placeholder="Eg. student’s tips, why students should learn coding"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAudience">Target Audience<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={formData.targetAudience}
                        placeholder="Eg. Parents, students"
                    />
                </div>

                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default HashtagGenerator;
