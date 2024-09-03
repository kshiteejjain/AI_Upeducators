import React, { useState, ChangeEvent, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
import BoardFormComponent from './BoardFormComponent';

const LessonPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const initialFormData = JSON.parse(localStorage.getItem('upEdu_prefix') || '{}');
    const [formData, setFormData] = useState({
        board: initialFormData.board || '',
        gradeLevel: initialFormData.gradeLevel || '',
        subject: initialFormData.subject || '',
        chapter: initialFormData.chapter || '',
        chapterDescription: initialFormData.chapterDescription || '',
        topicSubjectObjectives: '',
        addOns: [] as string[],
        otherAddOns: [] as string[],
        additionalDetails: '',
        otherAddOnsInput: ''
    });

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

    const handleChapterDescriptionChange = useCallback((description: string) => {
        setFormData(prevData => ({
            ...prevData,
            chapterDescription: description
        }));
    }, []);

    const checkAdditionalDetails = formData.board === 'CBSE Board' ? `The detailed outline of the unit is: ${formData.chapterDescription}` : '';

    const promptMessage = `Generate a detailed lesson plan for ${formData.gradeLevel} covering this Subject / Topic / Learning Objectives: ${formData.topicSubjectObjectives}. Along with the detailed plan consider these additional details: ${formData.additionalDetails}. The lesson plan should also have an additional section involving these elements: ${formData.otherAddOnsInput || formData.otherAddOns.join(', ')}. Follow this structure in the lesson plan output: Title, Subject/Topic, Grade Level, Duration, Learning Objectives, Materials/Resources, Introduction, Detailed Instructional Procedures, Lesson Activities, Assessment Criteria, Closure, Extended Activities, Reflection, Home Learning Tasks, ${formData.addOns.join(', ')}. ${checkAdditionalDetails}`;

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
                    <label htmlFor='board'>Select Board<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="board"
                        onChange={handleInputChange}
                        value={formData.board}>
                        <option value="Any Board">Any Board</option>
                        <option value="CBSE Board">CBSE Board</option>
                    </select>
                </div>
                {formData.board === 'CBSE Board' ? (
                    <BoardFormComponent
                        gradeLevel={formData.gradeLevel}
                        subject={formData.subject}
                        chapter={formData.chapter}
                        onInputChange={handleInputChange}
                        onChapterDescriptionChange={handleChapterDescriptionChange}
                    />
                ) : (
                    <>
                        <div className='form-group'>
                            <label htmlFor='gradeLevel'>Grade Level<span className="asterisk">*</span></label>
                            <select
                                required
                                className='form-control'
                                name="gradeLevel"
                                onChange={handleInputChange}
                                value={formData.gradeLevel}
                            >
                                <option value="">Select Grade Level</option>
                                {["Nursery", "Preparatory", "1st-Grade", "2nd-Grade", "3rd-Grade", "4th-Grade", "5th-Grade", "6th-Grade", "7th-Grade", "8th-Grade", "9th-Grade", "10th-Grade", "11th-Grade", "12th-Grade", "College-Level"].map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div className='form-group'>
                            <label htmlFor='topic'>Topic / Learning Objective<span className="asterisk">*</span></label>
                            <input
                                required
                                className="form-control"
                                name="topic"
                                onChange={handleInputChange}
                                value={formData.topic}
                                placeholder="e.g., Environmental Awareness, World War II, Algebra, Photosynthesis, Gravity"
                            />
                        </div>
                    </>
                )}

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
