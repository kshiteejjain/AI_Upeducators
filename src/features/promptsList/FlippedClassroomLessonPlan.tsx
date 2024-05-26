import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const FlippedClassroomLessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        subjectTopicObjectives: '',
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
    const promptMessage = `Generate a detailed lesson plan for a flipped classroom session. The plan should be for ${formData.gradeLevel} considering this subject/topic/learning objectives: ${formData.subjectTopicObjectives}.  It should also consider these additional details: ${formData.additionalDetails}.
    The lesson plan must include the Title, Learning Objectives, Duration, Materials/Resources, detailed Pre-Class Activities, In-Class Activities, Post-Class Activities, Assessment Criteria, Closure, Extended Activities, Reflection, Home Learning Tasks.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Flipped Classroom Lesson Plan </h2>
            <h3>Create a lesson plan tailored according to flipped classroom approach.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which the lesson plan is being created.">
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
                    <label htmlFor='subjectTopicObjectives'> Topic or Learning Objective <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='subjectTopicObjectives'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.subjectTopicObjectives}
                        placeholder="e.g., Mathematics, Forces and Motion, Analyzing historical events"
                    ></textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder={`For Example- Any Special Instruction, Learning Environment \n(e.g., Classroom, Online, Hybrid), Project Type \n(e.g., Research, Problem-solving, Collaborative), Project Duration \n(e.g.,1 class period, 1 week, 1 month).`}>
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default FlippedClassroomLessonPlan;
