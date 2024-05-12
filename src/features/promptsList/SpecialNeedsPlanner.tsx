import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SpecialNeedsPlanner = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        specialNeedsCategory: '',
        topicSubjectLearningObjective: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a teaching strategy for a student with ${formData.specialNeedsCategory} in ${formData.gradeLevel}.
    Consider this Topic/Subject/Learning Objective to be taught: ${formData.topicSubjectLearningObjective}.
    Include specific methods, tools, and approaches to address the student's needs and facilitate effective learning.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Special Needs Planner</h2>
            <h3>Generate customized strategies to teach students with special needs.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select required className="form-control" name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the current grade level of the student.</option>
                        <option value="Pre-K">Pre-K</option>
                        <option value="Kindergarten">Kindergarten</option>
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
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="specialNeedsCategory">Special Needs Category<span className="asterisk">*</span></label>
                    <input required className="form-control" name="specialNeedsCategory" onChange={handleInputChange} value={formData.specialNeedsCategory} placeholder="e.g., Autism, Dyslexia, Intellectual Disability, Speech or Language Impairment" />
                </div>

                <div className="form-group">
                    <label htmlFor="topicSubjectLearningObjective">Topic/Subject/Learning Objective<span className="asterisk">*</span></label>
                    <textarea required className="form-control" name="topicSubjectLearningObjective" onChange={handleInputChange} rows={5}
                        value={formData.topicSubjectLearningObjective} placeholder="e.g., Improving multiplication skills, Comprehension, Understanding the properties of acids and bases"></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default SpecialNeedsPlanner;