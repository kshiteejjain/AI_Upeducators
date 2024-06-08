import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const StudentWorkEvaluation = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        titleAssignment: '',
        studentWork: '',
        evaluationCriteria: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a detailed evaluation of the student work for a ${formData.gradeLevel} student based on this Title/Assignment Description: ${formData.titleAssignment} and the following text: ${formData.studentWork}]. 
    The criteria/rubric for evaluation with marks allocated for each criterion/rubric level is: ${formData.evaluationCriteria}.
    The assignment should be at par with the Title/Assignment Description: ${formData.titleAssignment}.
    The evaluation should follow the following structure: Criteria/Rubric Level, Detailed Point-wise analysis of Areas of strength, Areas for growth ((in consideration with the Title/Assignment Description:${formData.titleAssignment} and Marks awarded under each criteria/rubric level, Overall Comments, Total marks awarded.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Student Work Evaluation</h2>
            <h3>Evaluate student work and highlight their areas of strength and growth.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}>
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
                    <label htmlFor='titleAssignment'> Title/Assignment Description
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='titleAssignment'
                        onChange={handleInputChange}
                        value={formData.titleAssignment}
                        rows={5}
                        placeholder="e.g., 'The Importance of Water Conservation', Write a short story about an adventure in a magical forest." />
                </div>

                <div className='form-group'>
                    <label htmlFor='studentWork'> Student Work
                        <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className='form-control'
                        name='studentWork'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.studentWork}
                        placeholder='Provide the student&apos;s work for evaluation.'>
                    </textarea>
                </div>


                <div className='form-group'>
                    <label htmlFor='evaluationCriteria'> Evaluation Criteria/Rubric </label>
                    <textarea
                        className='form-control'
                        name='evaluationCriteria'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.evaluationCriteria}
                        placeholder='List the evaluation criteria/rubric with marks (e.g.,creativity-5, analytical skills-5, accuracy-5).' >
                    </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default StudentWorkEvaluation;
