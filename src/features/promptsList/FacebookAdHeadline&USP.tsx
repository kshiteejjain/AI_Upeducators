import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdHeadlineUSP = () => {
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
    const promptMessage = `Prompt Output:
    Need to generate a facebook ad for ${formData.courseSkillName}, and the audience is ${formData.audience}
    
    The format of the ad is as follows:
    1. A compelling and attractive headline
    Eg: Best Certification for Students after 12th
    
    2. A Unique selling point.
    Eg: Live classes by Experts on Weekends
    
    The word limit for the headline and the Unique selling points should not be more than 20 words. Don't generate anything else apart from Headline and USP. Generate 5 outputs.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook ad: Headline & USP</h2>
            <h3>Craft Facebook ad headlines & unique selling propositions (USP) effortlessly</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseSkillName"> Course/Skill Name <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="courseSkillName"
                        onChange={handleInputChange}
                        value={formData.courseSkillName}
                        placeholder="Eg. Yoga classes for kids, Maths tuition for class 6th"
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
                        placeholder="Eg. Parents, Teenagers"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FacebookAdHeadlineUSP;