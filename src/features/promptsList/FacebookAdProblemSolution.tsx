import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FacebookAdProblemSolution = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        courseSkillName: '',
        audience: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I want to create an ad on ${formData.courseSkillName}, the audience of my course is ${formData.audience} which has the following sections

    A problem statement: which Address a problem your target audience faces, in 6 to 8 words
    Eg: Struggling to stay updated with technology for Education?
    
    Solution : present your product or service as the solution in 8 - 10 words
    Eg: Become a Google certified educator and enhance your teaching skills
    
    Generate 5 such problem - solution statement
    `;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Facebook ad: Problem-solution</h2>
            <h3>Create ads with impactful problem-solution statements.</h3>
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
export default FacebookAdProblemSolution;