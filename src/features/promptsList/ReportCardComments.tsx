import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ReportCardComments = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        academicPerformance: '',
        behavioralAttributes: '',
        subjectArea: '',
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
    const promptMessage = `Generate a report card comment for a student in ${formData.gradeLevel} within 75 words. 
    The student has shown [Performance Level] performance and is ${formData.behavioralAttributes}. 
    Also, consider these additional details about the student: ${formData.additionalDetails}. The subject area is ${formData.subjectArea}.`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Report Card Comments</h2>
            <h3>Generate personalized and constructive report card comments for students.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select required className="form-control" name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the grade level of the student.</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st Grade">1st Grade</option>
                        <option value="2nd Grade">2nd Grade</option>
                        <option value="3rd Grade">3rd Grade</option>
                        <option value="4th Grade">4th Grade</option>
                        <option value="5th Grade">5th Grade</option>
                        <option value="6th Grade">6th Grade</option>
                        <option value="7th Grade">7th Grade</option>
                        <option value="8th Grade">8th Grade</option>
                        <option value="9th Grade">9th Grade</option>
                        <option value="10th Grade">10th Grade</option>
                        <option value="11th Grade">11th Grade</option>
                        <option value="12th Grade">12th Grade</option>
                        <option value="College Level">College Level</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="academicPerformance">Academic Performance<span className="asterisk">*</span></label>
                    <select required className="form-control" name="academicPerformance" onChange={handleInputChange} value={formData.academicPerformance}>
                        <option value="">Choose the student's performance level in the subject.</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Average">Average</option>
                        <option value="Below Average">Below Average</option>
                        <option value="Needs Improvement">Needs Improvement</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="behavioralAttributes">Behavioral Attributes<span className="asterisk">*</span></label>
                    <textarea required className="form-control" name="behavioralAttributes" onChange={handleInputChange} rows={5} value={formData.behavioralAttributes} placeholder="e.g., Respectful, Responsible, Attentive, Punctual, Eager to learn, Shows initiative, Needs guidance, Minimal engagement, Lacks confidence, Often absent or late, Easily distracted, Unfocused"></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="subjectArea">Subject Area</label>
                    <input className="form-control" name="subjectArea" onChange={handleInputChange} value={formData.subjectArea} placeholder="Enter the subject area for which the comment is required (e.g., Mathematics, Science, Co-curricular Activities)." />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <input className="form-control" name="additionalDetails" onChange={handleInputChange} value={formData.additionalDetails} placeholder="Areas of Strength, Areas of Weakness, Additional comments about the student's performance or behavior" />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ReportCardComments;