import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ThemeBasedAgeAppropriateStoryGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        ageGroup: 'Toddlers (0-3 years)',
        theme: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a ${formData.theme} themed story suitable for ${formData.ageGroup}.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>ThemeBased Age Appropriate Story Generator</h2>
            <h3>This form is designed for creating stories tailored to specific age groups and themes, ensuring the content is both suitable and engaging for the intended audience.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='ageGroup'> Age Group <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="ageGroup" onChange={handleInputChange} value={formData.ageGroup}>
                        <option value="Toddlers (0-3 years)">Toddlers (0-3 years)</option>
                        <option value="Preschool (4-5 years)">Preschool (4-5 years)</option>
                        <option value="Early Elementary (6-8 years)">Early Elementary (6-8 years)</option>
                        <option value="Late Elementary (9-11 years)">Late Elementary (9-11 years)</option>
                        <option value="Middle School (12-14 years)">Middle School (12-14 years)</option>
                        <option value="High School (15-18 years)">High School (15-18 years)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='theme'>Theme <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='theme' onChange={handleInputChange} value={formData.theme} placeholder='Write the central theme for the story.' />
                </div>
                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default ThemeBasedAgeAppropriateStoryGenerator;