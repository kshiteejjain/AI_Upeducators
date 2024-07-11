import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CustomQuestion = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const initialFormData = {
        gradeLevel: '',
        questionType: '',
        topic: '',
        difficultyLevel: [] as string[],
        contextPreference: '',
        additionalDetails: '',
        otherQuestionType: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isOtherQuestionType, setIsOtherQuestionType] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            setFormData((prevData) => ({
                ...prevData,
                difficultyLevel: checkbox.checked
                    ? [...prevData.difficultyLevel, value]
                    : prevData.difficultyLevel.filter((item) => item !== value)
            }));
        } else if (type === 'radio' && name === 'questionType') {
            setFormData((prevData) => ({
                ...prevData,
                questionType: value,
                otherQuestionType: value === 'Other' ? '' : prevData.otherQuestionType
            }));
            setIsOtherQuestionType(value === 'Other');
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const promptMessage = `Generate 10 ${isOtherQuestionType ? formData.otherQuestionType : formData.questionType} questions for ${formData.gradeLevel} on this Topic / Learning Objective: ${formData.topic}. 
    It should be framed within the context of ${formData.contextPreference} at a ${formData.difficultyLevel} difficulty level. 
    Also, consider these additional details: ${formData.additionalDetails}`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Custom Question</h2>
            <h3>Create questions based on your specific requirements.</h3>
            <form onSubmit={handleSubmit}>
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
                    <label htmlFor='questionType'>Question Type<span className="asterisk">*</span></label>
                    <div className="radio-options">
                        {["Multiple Choice", "True/False", "Short Answer", "Essay", "Fill in the Blanks", "Match the Following", "Other"].map(type => (
                            <div key={type} className="radio-option">
                                <label><input
                                    type="radio"
                                    name="questionType"
                                    value={type}
                                    checked={formData.questionType === type}
                                    onChange={handleInputChange}
                                /> {type}</label>
                            </div>
                        ))}
                    </div>
                </div>

                {isOtherQuestionType && (
                    <div className='form-group'>
                        <label htmlFor='otherQuestionType'>Other<span className="asterisk">*</span></label>
                        <input
                            required
                            className="form-control"
                            name="otherQuestionType"
                            onChange={handleInputChange}
                            value={formData.otherQuestionType}
                            placeholder="Specify the question type"
                        />
                    </div>
                )}

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

                <div className='form-group'>
                    <label>Difficulty Level</label>
                    <div className='checkbox-options'>
                        {["Easy", "Medium", "Hard"].map(level => (
                            <div key={level} className='checkbox-option'>
                                <input type="checkbox" id={level} name="difficultyLevel" onChange={handleInputChange} value={level} />
                                <label htmlFor={level}>{level}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='contextPreference'>Context Preference</label>
                    <textarea
                        className="form-control"
                        name="contextPreference"
                        onChange={handleInputChange}
                        value={formData.contextPreference}
                        placeholder="Mention the context or theme in which you prefer the questions to be framed (e.g., Cricket, Harry Potter, Space Exploration)"
                        rows={3}
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className="form-control"
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="e.g., word limit for essay questions, structure for multiple-choice options, any specific requirement"
                        rows={3}
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};

export default CustomQuestion;
