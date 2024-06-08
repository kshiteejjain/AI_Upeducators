import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const CoverLetter = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        jobRole: '',
        schoolName: '',
        keyHighlights: '',
        customMessage: ''

    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a professional cover letter for a candidate applying for this Job Role or Job Description: ${formData.jobRole}. 
    The letter is addressed to ${formData.schoolName} and should highlight these key applicant details: ${formData.keyHighlights}. 
    Also, include this custom message: ${formData.customMessage}.
    The length of the letter should be at most 125 words.`
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Cover Letter </h2>
            <h3>Generate cover letters tailored to the job role.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="jobRole">Job Role or Job Description<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="jobRole"
                        value={formData.jobRole}
                        onChange={handleInputChange}
                        placeholder="e.g., Mathematics Teacher in a CBSE Board School, Administrator, Counselor, Science Teacher for Secondary Level, Online Teacher for Coding"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="schoolName">School or Organization Name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="schoolName"
                        value={formData.schoolName}
                        onChange={handleInputChange}
                        placeholder="Enter the name of the school or organization you are applying to."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="keyHighlights">Key Highlights<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="keyHighlights"
                        value={formData.keyHighlights}
                        onChange={handleInputChange}
                        placeholder="e.g., Experience, Qualifications, Skills, Personal Traits, Achievements, and Accomplishments"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="customMessage">Custom Message</label>
                    <textarea
                        className="form-control"
                        name="customMessage"
                        value={formData.customMessage}
                        onChange={handleInputChange}
                        placeholder="A brief message or statement you want to be included in the letter."
                    ></textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default CoverLetter;