import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ActivityGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        gradeLevel: '',
        subjectTopic: '',
        activityType: '',
        duration: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate an engaging activity for ${formData.gradeLevel} students. The activity should be based on this Subject/Topic/Learning Objectives: ${formData.subjectTopic}. The timeframe should be ${formData.duration} and the activity type should be ${formData.activityType} activity. 
    Follow this structure in the output: Title, Duration, Activity Overview, Learning Objectives, Resources needed, duration-wise detailed Activity Plan, Assessment, Closure, and Reflection.
    In case you want to add something else in the structure to make it better, then you can do it.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Activity Generator</h2>
            <h3>Create customized educational activities.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which you are creating the activity.">
                        <option value="">Select the grade level</option>
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
                    <label htmlFor='subjectTopic'>Subject/Topic/Learning Objectives
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name="subjectTopic"
                        onChange={handleInputChange}
                        value={formData.subjectTopic}
                        placeholder="History, Motion and Movement, Mathematics, Language Arts, Develop critical thinking">
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='activityType'>Activity Type</label>
                    <input
                        className='form-control'
                        name="activityType"
                        onChange={handleInputChange}
                        value={formData.activityType}
                        placeholder="e.g., Interactive, Hands-On, Group, Game Based, Reflective and Metacognitive, Technology-Integrated" />
                </div>

                <div className='form-group'>
                    <label htmlFor='duration'>Duration</label>
                    <input
                        className='form-control'
                        name="duration"
                        onChange={handleInputChange}
                        value={formData.duration}
                        placeholder="e.g., 15 minutes, 30 minutes, 1 Class Period" />
                </div>


                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default ActivityGenerator;
