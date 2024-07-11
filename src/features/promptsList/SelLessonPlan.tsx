import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SelLessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        selFocusArea: '',
        additionalDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a detailed SEL lesson plan for ${formData.gradeLevel} students focusing on ${formData.selFocusArea}. The lesson plan should include these additional details:  ${formData.additionalDetails}. 
    Follow this structure in the lesson plan output: Title, Learning Objectives, Duration, Materials/Resources, Introduction, Warm-Up Activity, Detailed Instructional Procedures, 5 Lesson Activities, Assessment Criteria, Closure, Extended Activities, Reflection, Home Tasks, Differentiation Strategies`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>SEL Lesson Plan</h2>
            <h3>Create a Social Emotional Learning (SEL) lesson plan tailored as per students needs.</h3>
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
                        <option value="">Select the grade level of the students for whom the lesson plan is intended</option>
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
                    <label htmlFor='selFocusArea'> SEL Focus Area
<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="selFocusArea"
                        onChange={handleInputChange}
                        value={formData.selFocusArea}>
                        <option value="">Choose the primary focus area of the SEL lesson plan</option>
                        <option value="Self-Awareness">Self-Awareness</option>
                        <option value="Self-Management">Self-Management</option>
                        <option value="Social-Awareness">Social Awareness</option>
                        <option value="Relationship-Skills">Relationship Skills</option>
                        <option value="Responsible-Decision-Making">Responsible Decision-Making</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder='e.g., Specific Topic, Standards, Objective, Learning Materials, Activities, Duration.'>
                    </textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default SelLessonPlan;
