import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ResumeRewriter = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        currentResume: '',
        jobDescription: '',
        keyHighlights: '',

    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Rewrite and Tailor the resume below according to this Job Description: ${formData.jobDescription}.
    “${formData.currentResume}”
    Emphasize these Key Highlights in the Resume: ${formData.keyHighlights}.
    Follow this structure in the output: Contact Details, Professional Summary, Work Experience, Educational Background, Skills, and Additional Section (with relevant sub-category).
    Follow this format for showing the Educational background information: 
    (Degree Type) in (Area of Study)
    (Name of Institution), (Location of Institution)
    (Month Year of Graduation)
    The resume should be well-organized and effectively showcase the educator's strengths, qualifications, and readiness for the potential job, making it compelling for employers.
    It should be tailored according to the job description.`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Resume Rewriter</h2>
            <h3>Tailor your resume to align with the job description or update your current resume to make it more impactful.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="currentResume">Current Resume<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="currentResume"
                        onChange={handleInputChange}
                        value={formData.currentResume}
                        placeholder="Paste your current resume that has to be re-written."
                        rows={5}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="jobDescription">Job Description<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="jobDescription"
                        onChange={handleInputChange}
                        value={formData.jobDescription}
                        placeholder="Paste the full job description to tailor the resume to specific job requirements."
                        rows={5}
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="keyHighlights">Key Highlights</label>
                    <textarea
                        className="form-control"
                        name="keyHighlights"
                        onChange={handleInputChange}
                        value={formData.keyHighlights}
                        placeholder="List any specific achievements, skills, projects or accomplishments you want to highlight in the resume."
                        rows={5}
                    ></textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ResumeRewriter;