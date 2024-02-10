import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CustomQuestionGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        questionType: 'Multiple Choice',
        subjectArea: '',
        gradeLevel: 'Nursery',
        topic: '',
        difficultyLevel: 'Easy',
        numberOfQuestions: 1,
        specificFormatRequirements: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate ${formData.numberOfQuestions} ${formData.questionType} questions in ${formData.subjectArea} for ${formData.gradeLevel} for ${formData.topic} at a ${formData.difficultyLevel} difficulty. ${formData.specificFormatRequirements ? `(${formData.specificFormatRequirements})` : ''}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Custom Question Generator</h2>
            <h3>This form helps create tailored questions for educational or training purposes.</h3>
            <form onSubmit={handleSubmit}>
                {/* Field 1: Question Type */}
                <div className='form-group'>
                    <label htmlFor='questionType'> Question Type <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="questionType" onChange={handleInputChange} value={formData.questionType}>
                        <option value="Multiple Choice">Multiple Choice</option>
                        <option value="True/False">True/False</option>
                        <option value="Short Answer">Short Answer</option>
                        <option value="Essay">Essay</option>
                        <option value="Fill in the Blanks">Fill in the Blanks</option>
                        <option value="Match the Following">Match the Following</option>
                    </select>
                </div>
                {/* Field 2: Subject Area */}
                <div className='form-group'>
                    <label htmlFor='subjectArea'>Subject Area <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='subjectArea' onChange={handleInputChange} value={formData.subjectArea} placeholder='Specify the subject or topic for the question (e.g., Mathematics, History).' />
                </div>
                {/* Field 3: Grade Level */}
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-grade">3rd Grade</option>
                        <option value="4th-grade">4th Grade</option>
                        <option value="5th-grade">5th Grade</option>
                        <option value="6th-grade">6th Grade</option>
                        <option value="7th-grade">7th Grade</option>
                        <option value="8th-grade">8th Grade</option>
                        <option value="9th-grade">9th Grade</option>
                        <option value="10th-grade">10th Grade</option>
                        <option value="11th-grade">11th Grade</option>
                        <option value="12th-grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>
                {/* Field 4: Topic */}
                <div className='form-group'>
                    <label htmlFor='topic'>Topic <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='topic' onChange={handleInputChange} value={formData.topic} placeholder='Mention the topic' />
                </div>
                {/* Field 5: Difficulty Level */}
                <div className='form-group'>
                    <label htmlFor='difficultyLevel'> Difficulty Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="difficultyLevel" onChange={handleInputChange} value={formData.difficultyLevel}>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                {/* Field 6: Number of Questions */}
                <div className='form-group'>
                    <label htmlFor='numberOfQuestions'> Number of Questions<span className='asterisk'>*</span> </label>
                    <input required type="number" className='form-control' name='numberOfQuestions' onChange={handleInputChange} value={formData.numberOfQuestions} placeholder='Enter the number of questions you want to generate.' />
                </div>
                {/* Field 7: Specific Format Requirements */}
                <div className='form-group'>
                    <label htmlFor='specificFormatRequirements'> Specific Format Requirements</label>
                    <textarea className='form-control' name='specificFormatRequirements' onChange={handleInputChange} rows={5} value={formData.specificFormatRequirements} placeholder='Describe any specific formatting requirements (e.g., word limit for essay questions, structure for multiple-choice options).'></textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default CustomQuestionGenerator;
