import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ReportCardCommentsGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        studentName: '',
        gradeLevel: 'Nursery',
        academicPerformance: 'Excellent',
        areasOfStrength: '',
        areasOfWeakness: '',
        behavioralAttributes: '',
        length: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a personalized report card comment for ${formData.studentName}, a grade ${formData.gradeLevel} student. Consider their academic performance as ${formData.academicPerformance}. ${formData.studentName} demonstrates ${formData.behavioralAttributes}. Word Limit should be ${formData.length}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Report Card Comments</h2>
            <h3>Generate personalized and constructive report card comments for students.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='studentName'> Student Name <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='studentName' onChange={handleInputChange} value={formData.studentName} placeholder='Enter the full name of the student.' />
                </div>
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
                <div className='form-group'>
                    <label htmlFor='academicPerformance'> Academic Performance </label>
                    <select className='form-control' name="academicPerformance" onChange={handleInputChange} value={formData.academicPerformance}>
                        {/* Options for Academic Performance */}
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='areasOfStrength'> Areas of Strength </label>
                    <input className='form-control' name='areasOfStrength' onChange={handleInputChange} value={formData.areasOfStrength} placeholder='List the student"s key strengths.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='areasOfWeakness'> Areas of Weakness </label>
                    <input className='form-control' name='areasOfWeakness' onChange={handleInputChange} value={formData.areasOfWeakness} placeholder='List the student"s key areas for improvement.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='behavioralAttributes'> Behavioral Attributes </label>
                    <input className='form-control' name='behavioralAttributes' onChange={handleInputChange} value={formData.behavioralAttributes} placeholder='Describe key behavioral attributes observed in the student.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='length'> Length </label>
                    <input className='form-control' name='length' onChange={handleInputChange} value={formData.length} placeholder='Specify the desired length of the Comment (e.g., 50 words, 100 words)' />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ReportCardCommentsGenerator;
