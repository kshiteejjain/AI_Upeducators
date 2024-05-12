import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const MockInterview = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        jobRoleDescription: '',

    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 15 interview questions considering this Job Role or the Job Description: ${formData.jobRoleDescription}. The candidate has ${formData.experienceYears} of experience and is applying to the ${formData.board} school board.  
    The questions should be tailored to assess the candidate's suitability for the role, subject matter expertise, educational philosophy, teaching methodology, problem-solving skills, and personal growth in the education sector. It should give them an insight into how to prepare for the interview.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Mock Interview</h2>
            <h3>Simulate a real interview environment and generate custom mock interview questions.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="jobRoleDescription">Job Role or Job Description <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="jobRoleDescription"
                        onChange={handleInputChange}
                        value={formData.jobRoleDescription}
                        placeholder="e.g., Mathematics Teacher in a CBSE Board School, Administrator, Counselor, Science Teacher for Secondary Level, Online Teacher for Coding"
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default MockInterview;