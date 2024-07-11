import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FiveEModelLessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicLearningObjectives: '',
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
    const promptMessage = `Generate a detailed 5E Model Lesson Plan for ${formData.gradeLevel}. Consider the Topic / Learning objective: ${formData.topicLearningObjectives}.
    Also include these additional details: ${formData.additionalDetails}.
    The plan should follow this structure: Title, Learning Objectives, the duration of the lesson, a detailed plan for each of the 5E stages (Engage, Explore, Explain, Elaborate, Evaluate).
    Within each 5E stage the plan should be divided into Activity, Objective, Materials, Point-Wise Process.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>5E Model Lesson Plan</h2>
            <h3>Create lesson plans for your science class based on the 5E instructional model.</h3>
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
                        <option value="">Select the grade level for which you are creating the lesson plan</option>
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
                    <label htmlFor='topicLearningObjectives'> Topic / Learning Objectives
<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='topicLearningObjectives'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.topicLearningObjectives}
                        placeholder='e.g., Photosynthesis, Analyze the benefits of using solar energy as a renewable resource.'>
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder='e.g., Duration, Assessment Method, Materials needed, Learning Environment.'>
                    </textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FiveEModelLessonPlan;
