import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const AssignmentGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topicLearningObjectives: '',
        assignmentType: '',
        duration: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a detailed assignment for ${formData.gradeLevel} students. The assignments should be based on this topic/learning objectives: ${formData.topicLearningObjectives}. The timeframe should be ${formData.duration} and the assignment type should be ${formData.assignmentType}.
    Follow this structure in the output: Title, Duration, Assignment Overview, Learning Objectives, Resources needed, duration-wise detailed Assignment Plan, Assessment, and Reflection.
    In case you want to add something else in the structure to make it better, then you can do it`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Assignment Generator</h2>
            <h3>Generate assignments on any topic.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level <span className="asterisk">*</span></label>
                    <select className="form-control" name="gradeLevel" required onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the grade level for which the assignment is intended.</option>
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
                    <label htmlFor="topicLearningObjectives">Topic / Learning Objectives <span className="asterisk">*</span></label>
                    <textarea className="form-control" name="topicLearningObjectives" required onChange={handleInputChange} value={formData.topicLearningObjectives} placeholder="e.g., World History, Forces and Motion, analyzing historical events, comprehending plant biology"></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="assignmentType">Assignment Type</label>
                    <input className="form-control" name="assignmentType" onChange={handleInputChange} value={formData.assignmentType} placeholder="e.g., Essay, Research Paper, Case Study, Problem Solving, Creative Writing" />
                </div>

                <div className="form-group">
                    <label htmlFor="duration">Duration</label>
                    <input className="form-control" name="duration" onChange={handleInputChange} value={formData.duration} placeholder="e.g., 3 className periods, 1 week, 1 month, Longer" />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default AssignmentGenerator;
