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
    const promptMessage = `Please assume the role of an interviewer for this Job Role or Job Description: ${formData.jobRoleDescription}. 
    I will be the candidate, and we will engage in a conversation with you asking interview questions one at a time, without any explanations. We’ll begin with a greeting, “Hi”, and continue the interview as I provide answers to your questions. Your follow-up question can be based on my reply.
    The questions should be tailored to assess my suitability for the role, Subject matter expertise,`
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