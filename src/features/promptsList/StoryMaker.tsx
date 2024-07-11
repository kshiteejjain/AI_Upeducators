import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const StoryMaker = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicTheme: '',
        textLength: '',
        customizationDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a story for a ${formData.gradeLevel} student about: ${formData.topicTheme}. 
    The story should be around ${formData.textLength} in length.
    It should also consider these additional details: ${formData.customizationDetails}.
    Give a suitable ‘Title’ to the story.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Story Maker</h2>
            <h3>Create stories tailored to specific themes, events, or situations.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level
<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}>
                        <option value="">Select the grade level of your students</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-Grade">3rd Grade</option>
                        <option value="4th-Grade">4th Grade</option>
                        <option value="5th-Grade">5th Grade</option>
                        <option value="6th-Grade">6th Grade</option>
                        <option value="7th-Grade">7th Grade</option>
                        <option value="8th-Grade">8th Grade</option>
                        <option value="9th-Grade">9th Grade</option>
                        <option value="10th-Grade">10th Grade</option>
                        <option value="11th-Grade">11th Grade</option>
                        <option value="12th-Grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>


                <div className='form-group'>
                    <label htmlFor='topicTheme'>Topic or Theme
<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='topicTheme'
                        onChange={handleInputChange}
                        value={formData.topicTheme}
                        placeholder="e.g., Celebrating ‘Cultural Diversity’, Developing ‘Empathy’, First Day at School, Building ‘Self-Confidence’, Visiting the Dentist, Helping a Neighbor in Need"
                        rows={5} 
                        />
                </div>

                <div className='form-group'>
                    <label htmlFor='textLength'> Text Length<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name='textLength'
                        onChange={handleInputChange}
                        value={formData.textLength}>
                        <option value="">Choose the desired length of the text.</option>
                        <option value="Short">Short (up to 200 words)</option>
                        <option value="Medium">Medium (200-400 words)</option>
                        <option value="Long">Long (400-600 words)</option>
                        <option value="Very-Long">Very Long (600-800 words)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='customizationDetails'> Customization Details </label>
                    <textarea
                        className='form-control'
                        name='customizationDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.customizationDetails}
                        placeholder='e.g., Character Names and Traits, Key Focus Areas, Student"s Interests or Hobbies, Special Considerations, Story Background' />

                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default StoryMaker;
