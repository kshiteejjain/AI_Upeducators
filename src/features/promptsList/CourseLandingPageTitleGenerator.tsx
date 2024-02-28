import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
const CourseLandingPageTitleGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        courseName: '',
        targetAudience: '',
        keyBenefit: '',
        courseLevel: 'Beginner',
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 engaging and descriptive titles for the course landing page. The title should include ${formData.courseName}, and may also incorporate ${formData.targetAudience}, focusing on ${formData.keyBenefit}, suitable for ${formData.courseLevel} learners if these fields are provided. The title should be clear, concise, and appealing to the target audience.            `
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Course Landing Page Title Generator</h2>
            <h3>Create compelling and descriptive titles for course landing pages, tailored to attract the target audience and clearly communicate the course's value.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='courseName'>Course Name <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseName' onChange={handleInputChange} value={formData.courseName} placeholder='Enter the name of the course, e.g., "Advanced Python Programming.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience</label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify the target audience, such as "beginners", "experienced developers", or "data scientists".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='keyBenefit'>Key Benefit</label>
                    <input required className='form-control' name='keyBenefit' onChange={handleInputChange} value={formData.keyBenefit} placeholder='Describe a key benefit or outcome of the course, for example, "build complex applications" or "master data analysis".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseLevel'> Course Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="courseLevel" onChange={handleInputChange} value={formData.courseLevel}>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="AllLevels">All Levels</option>
                    </select>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default CourseLandingPageTitleGenerator;