import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdHeadlineBenefits = () => {
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
    const promptMessage = `Need to generate a facebook ad for ${formData.courseSkillName}, and the audience is ${formData.audience}

    The format of the ad is as follows:
    
    1 compelling and attractive headline
    Eg: Best Course for Parents in this Digital age
    
    3 Key benefits. Each benefit should be less than 9 words.
    Eg: 1. Learn 18+ Google tools
    2. Learn from Top Experts
    3. Become a Certified Tech Parent
    Don't stick to examples only
    
    Generate 5 sets of 1 headline and 3 Benefits, each benefit with less than 9 words
    `
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook ad: Headline & Benefits</h2>
            <h3>Create Headline &  benefits for Facebook ads creative</h3>
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
export default FacebookAdHeadlineBenefits;