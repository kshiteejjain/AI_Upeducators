import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BloomsTaxonomy = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const initialFormData = {
        gradeLevel: '',
        topic: '',
        bloomsTaxonomyLevels: [] as string[],
        questionType: '',
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
                bloomsTaxonomyLevels: checkbox.checked
                    ? [...prevData.bloomsTaxonomyLevels, value]
                    : prevData.bloomsTaxonomyLevels.filter((item) => item !== value)
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

    const promptMessage = `Generate 10 ${isOtherQuestionType ? formData.otherQuestionType : formData.questionType} questions for ${formData.gradeLevel} on this Topic / Learning Objective: ${formData.topic}. It should focus on ${formData.bloomsTaxonomyLevels.join(', ')} levels of Bloom's Taxonomy. Ensure the questions are appropriate for the educational level and taxonomy stages selected. Also show the selected level i.e., ${formData.bloomsTaxonomyLevels.join(', ')} with each question.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Bloom's Taxonomy</h2>
            <h3>Generate questions as per Bloom's Taxonomy.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}>
                        <option value="">Select the grade level for the questions</option>
                        {["Nursery", "Preparatory", "1st-Grade", "2nd-Grade", "3rd-Grade", "4th-Grade", "5th-Grade", "6th-Grade", "7th-Grade", "8th-Grade", "9th-Grade", "10th-Grade", "11th-Grade", "12th-Grade", "College-Level"].map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="topic">Topic / Learning Objective<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Algebra, World War II, Digestive System, Simple Machines"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='bloomsTaxonomyLevels'>Bloom's Taxonomy Levels<span className="asterisk">*</span></label>
                    <div className='checkbox-group'>
                        {["Remembering", "Understanding", "Applying", "Analyzing", "Evaluating", "Creating"].map(level => (
                            <label key={level}>
                                <input
                                    type='checkbox'
                                    name={level}
                                    value={level}
                                    onChange={handleInputChange}
                                /> {level}
                            </label>
                        ))}
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='questionType'>Question Type<span className="asterisk">*</span></label>
                    <div className="radio-options">
                        {["Multiple Choice", "True/False", "Short Answer", "Essay", "Fill in the Blanks", "Match the Following", "Other"].map(type => (
                            <div key={type} className="radio-option">
                                <label>
                                <input
                                    type="radio"
                                    name="questionType"
                                    value={type}
                                    checked={formData.questionType === type}
                                    onChange={handleInputChange}
                                />
                                    {type}</label>
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

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};

export default BloomsTaxonomy;
