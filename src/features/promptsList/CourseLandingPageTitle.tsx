import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
const CourseLandingPageTitle = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        courseName: '',
        targetAudience: '',
        keywordFocus: '',
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 10 engaging and descriptive titles for the course landing page. The title should include '${formData.courseName}', and may also incorporate '${formData.targetAudience}', focusing on '${formData.keywordFocus}'. The title should be clear, concise, and appealing to the target audience.    `
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Course Landing Page Title</h2>
            <h3>Create compelling titles for course landing pages, tailored to attract the target audience and clearly communicate the course's value.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseName"> Course Name <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="courseName"
                        onChange={handleInputChange}
                        value={formData.courseName}
                        placeholder="Eg. Advanced Python Programming."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="targetAudience"> Target Audience </label>
                    <input
                        className="form-control"
                        name="targetAudience"
                        onChange={handleInputChange}
                        value={formData.targetAudience}
                        placeholder="Eg. beginners"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="keywordFocus"> Keyword to Focus on <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="keywordFocus"
                        onChange={handleInputChange}
                        value={formData.keywordFocus}
                        placeholder="Eg. 1 to 1 classes, Become expert, Affordable fees"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default CourseLandingPageTitle;