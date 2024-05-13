import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const LessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicSubjectObjectives: '',
        addOns: [] as string[],
        additionalDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
    
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            if (checkbox.checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    addOns: [...prevData.addOns, value]
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    addOns: prevData.addOns.filter((item) => item !== value)
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const promptMessage = `Generate a detailed lesson plan for ${formData.gradeLevel} covering this Subject / Topic / Learning Objectives: ${formData.topicSubjectObjectives}. Along with the detailed plan consider these additional  details: ${formData.additionalDetails}
    The lesson plan should also have an additional section involving these elements: ${formData.addOns}.
    Follow this structure in the lesson plan output: Title, Subject/Topic, Grade Level, Duration, Learning Objectives, Materials/Resources, Introduction, Detailed Instructional Procedures, Lesson Activities, Assessment Criteria, Closure, Extended Activities, Reflection, Home Learning Tasks, ${formData.addOns}.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Lesson Plan Generator</h2>
            <h3>Generate lesson plans for any subject or topic </h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which you are planning the lesson.">
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
                    <label htmlFor='topicSubjectObjectives'> Topic / Subject / Learning Objectives <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='topicSubjectObjectives'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.topicSubjectObjectives}
                        placeholder="e.g., Gravitational Force, English, Implement the concepts of Perimeter and Area"
                    ></textarea>
                </div>

                <div className='form-group'>
                <label htmlFor='addOns'> Add-Ons</label>
                    <div className='checkbox-options'>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="differentiationStrategies" name="differentiationStrategies" onChange={handleInputChange} value='differentiationStrategies' />
                            <label htmlFor="differentiationStrategies">Differentiation Strategies</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="startupWarmUpActivity" name="startupWarmUpActivity" onChange={handleInputChange} value='startupWarmUpActivity' />
                            <label htmlFor="startupWarmUpActivity">Startup/Warm Up Activity</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="lifeSkills" name="lifeSkills" onChange={handleInputChange} value='lifeSkills' />
                            <label htmlFor="lifeSkills">Life Skills</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="correlationWithOtherSubjects" name="correlationWithOtherSubjects" onChange={handleInputChange} value='correlationWithOtherSubjects' />
                            <label htmlFor="correlationWithOtherSubjects">Correlation with other Subjects</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="hotsQuestions" name="hotsQuestions" onChange={handleInputChange} value='hotsQuestions' />
                            <label htmlFor="hotsQuestions">HOTS Questions</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="learningLogs" name="learningLogs" onChange={handleInputChange} value='learningLogs' />
                            <label htmlFor="learningLogs">Learning Logs</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="teacherInterventions" name="teacherInterventions" onChange={handleInputChange} value='teacherInterventions' />
                            <label htmlFor="teacherInterventions">Teacher Interventions</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="additionalNotes" name="additionalNotes" onChange={handleInputChange} value='additionalNotes' />
                            <label htmlFor="additionalNotes">Additional Notes</label>
                        </div>
                        <div className='checkbox-option'>
                            <input type="checkbox" id="learningOutcomes" name="learningOutcomes" onChange={handleInputChange} value='learningOutcomes' />
                            <label htmlFor="learningOutcomes">Learning Outcomes</label>
                        </div>
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder="e.g., Duration of the Lesson, Special Instructions, Assessment Type, Teaching Method, Learning Environment"
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default LessonPlan;