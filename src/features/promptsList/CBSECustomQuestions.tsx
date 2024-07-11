import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CBSECustomQuestions = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    // Fetching data from localStorage
    const initialFormData = JSON.parse(localStorage.getItem('upEdu_prefix') || '{}');
    const [formData, setFormData] = useState({
        gradeLevel: initialFormData.gradeLevel || '',
        subject: initialFormData.subject || '',
        questionType: '',
        chapter: initialFormData.chapter || '',
        chapterDescription: initialFormData.chapterDescription || '',
        difficultyLevel: [] as string[],
        contextPreference: '',
        additionalDetails: '',
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checkbox = e.target as HTMLInputElement;
            if (checkbox.checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    difficultyLevel: [...prevData.difficultyLevel, value]
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    difficultyLevel: prevData.difficultyLevel.filter((item) => item !== value)
                }));
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const promptMessage = `Generate 10 ${formData.questionType} questions for ${formData.gradeLevel} on ${formData.chapter}. It should be framed within the context of 
    ${formData.contextPreference} at a ${formData.difficultyLevel} difficulty level. Also, consider these additional details: ${formData.additionalDetails}
    The detailed outline of the unit is: ${formData.chapterDescription}`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        localStorage.removeItem('upEdu_prefix'); // Remove stored data after submitting
    };

    return (
        <div className="generator-section">
            <h2>CBSE Custom Questions</h2>
            <h3>Create questions based on your Board and specific requirements.</h3>
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
                        disabled
                        placeholder="Select the grade level for which the questions are being created">
                        <option value="">{formData?.gradeLevel}</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='subject'>Subject
<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="subject"
                        onChange={handleInputChange}
                        value={formData.subject}
                        disabled
                        >
                        <option value="">{formData?.subject}</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='chapter'>Chapter
<span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="chapter"
                        onChange={handleInputChange}
                        value={formData.chapter}
                        disabled
                        >
                        <option value="">{formData?.chapter}</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='questionType'>Question Type</label>
                    <input
                        className='form-control'
                        name="questionType"
                        onChange={handleInputChange}
                        value={formData.questionType}
                        placeholder="Multiple Choice, True/False, Short Answer, Essay, Fill in the Blanks, Match the Following" />
                </div>

                <div className='form-group'>
                    <label> Difficulty Level </label>
                    <div className='checkbox-options'>
                        <div className='checkbox-option'>
                            <label htmlFor="easy"><input type="checkbox" id="easy" name="easy" onChange={handleInputChange} value='easy' /> Easy</label>
                        </div>
                        <div className='checkbox-option'>
                            <label htmlFor="medium"><input type="checkbox" id="medium" name="medium" onChange={handleInputChange} value='medium' /> Medium</label>
                        </div>
                        <div className='checkbox-option'>
                            <label htmlFor="hard"><input type="checkbox" id="hard" name="hard" onChange={handleInputChange} value='hard' /> Hard</label>
                        </div>
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='contextPreference'>Context Preference</label>
                    <input
                        className='form-control'
                        name="contextPreference"
                        onChange={handleInputChange}
                        value={formData.contextPreference}
                        placeholder="Mention the context or theme in which you prefer the questions to be framed (e.g., Cricket, Harry Potter, Space Exploration)" />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <input
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="e.g., word limit for essay questions, structure for multiple-choice options, any specific requirement" />
                </div>

                <Button title='Generate' type="submit" />

            </form>
            <p><strong>Prompt:</strong> {promptMessage}</p>
        </div>
    )
};

export default CBSECustomQuestions;
