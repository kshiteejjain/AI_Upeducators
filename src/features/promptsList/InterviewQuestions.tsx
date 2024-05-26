import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const InterviewQuestions = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        jobRoleDescription: '',
        board: '',
        experienceYears: '',

    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 15 interview questions considering this Job Role or the Job Description: ${formData.jobRoleDescription}.The candidate has ${formData.experienceYears} of experience and is applying to the ${formData.board} board.  
    The questions should be tailored to assess the candidate's suitability for the role, subject matter expertise, educational philosophy, teaching methodology, problem-solving skills, and personal growth in the education sector. It should give them an insight into how to prepare for the interview.`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Interview Questions</h2>
            <h3>Generate interview questions to prepare yourself for the relevant job.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="jobRoleDescription">Job Role or Job Description <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="jobRoleDescription"
                        onChange={handleInputChange}
                        value={formData.jobRoleDescription}
                        placeholder="e.g., Mathematics Teacher, Administrator, Counselor, Science Teacher for Secondary Level, Online Teacher for Coding"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="experienceYears">Experience Years <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="experienceYears"
                        onChange={handleInputChange}
                        value={formData.experienceYears}
                    >
                        <option value="">Select your total years of teaching experience.</option>
                        <option value="Less than 1 year">Less than 1 year</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="More than 10 years">More than 10 years</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="board">Board</label>
                    <select
                        className="form-control"
                        name="board"
                        onChange={handleInputChange}
                        value={formData.board}
                    >
                        <option value="">Select the educational board you are applying to.</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="IGCSE">IGCSE</option>
                        <option value="IB">IB</option>
                        <option value="State Board">State Board</option>
                    </select>
                </div>



                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default InterviewQuestions;