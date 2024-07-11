import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const LessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const initialFormData = {
        gradeLevel: '',
        topicSubjectObjectives: '',
        addOns: [] as string[],
        otherAddOns: [] as string[],
        additionalDetails: '',
        otherAddOnsInput: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isOthersAddon, setIsOthersAddon] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        if (value === "Other") {
            setIsOthersAddon(checked);
            setFormData((prevData) => ({
                ...prevData,
                otherAddOns: checked
                    ? [...prevData.otherAddOns, value]
                    : prevData.otherAddOns.filter((item) => item !== value)
            }));
            if (!checked) {
                setFormData((prevData) => ({ ...prevData, otherAddOnsInput: '' }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                otherAddOns: checked
                    ? [...prevData.otherAddOns, value]
                    : prevData.otherAddOns.filter((item) => item !== value),
                otherAddOnsInput: value === 'Other' && !checked ? '' : prevData.otherAddOnsInput
            }));
            setIsOthersAddon(false);
        }
    };

    const promptMessage = `Generate a detailed lesson plan for ${formData.gradeLevel} covering this Subject / Topic / Learning Objectives: ${formData.topicSubjectObjectives}. Along with the detailed plan consider these additional details: ${formData.additionalDetails}. The lesson plan should also have an additional section involving these elements: ${formData.otherAddOnsInput || formData.otherAddOns.join(', ')}. Follow this structure in the lesson plan output: Title, Subject/Topic, Grade Level, Duration, Learning Objectives, Materials/Resources, Introduction, Detailed Instructional Procedures, Lesson Activities, Assessment Criteria, Closure, Extended Activities, Reflection, Home Learning Tasks, ${formData.addOns.join(', ')}.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Lesson Plan</h2>
            <h3>Generate lesson plans for any subject or topic</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the grade level for which you are planning the lesson.">
                        <option value="">Select Grade Level</option>
                        {["Nursery", "Preparatory", "1st-Grade", "2nd-Grade", "3rd-Grade", "4th-Grade", "5th-Grade", "6th-Grade", "7th-Grade", "8th-Grade", "9th-Grade", "10th-Grade", "11th-Grade", "12th-Grade", "College-Level"].map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='topicSubjectObjectives'>Topic / Subject / Learning Objectives<span className="asterisk">*</span></label>
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
                    <label htmlFor='otherAddOns'>Addons</label>
                    <div className="checkbox-options">
                        {["Learning Outcomes", "Differentiation Strategies", "Startup/Warm Up Activity", "Life Skills", "Support Strategies", "Correlation with other Subjects", "HOTS Questions", "21st Century Skills", "Gamification Ideas", "Entry and Exit Tickets", "Other"].map(skill => (
                            <div key={skill} className="checkbox-option">
                                <label>
                                <input
                                    type="checkbox"
                                    name="otherAddOns"
                                    value={skill}
                                    checked={formData.otherAddOns.includes(skill)}
                                    onChange={handleCheckboxChange}
                                />
                                    {skill}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {isOthersAddon && (
                    <div className='form-group'>
                        <label htmlFor='otherAddOnsInput'>Others<span className="asterisk">*</span></label>
                        <input
                            required
                            className='form-control'
                            name="otherAddOnsInput"
                            onChange={handleInputChange}
                            value={formData.otherAddOnsInput}
                            placeholder="Others"
                        />
                    </div>
                )}

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
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
    );
};

export default LessonPlan;
