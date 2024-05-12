import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ResumeGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        jobRole: '',
        teachingExperience: '',
        educationalBackground: '',
        skills: '',
        additionalSections: '',
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
    const promptMessage = `Generate a professional and comprehensive resume by considering the following details:
    Tailor the resume to align with the specific requirements as per this Job Role or Job Description: ${formData.jobRole}.
    Detail the teaching ‘Work Experience’ with minimum 3 point-wise accomplishments under: [Five Teaching Experiences].
    Incorporate this in ‘Educational Background’ information: ${formData.educationalBackground}.
    Highlight the candidate's skills under the ‘Skills’ section: [Skills].
    
    Feature these details under ‘Additional Section’ by giving a suitable sub-category name: ${formData.additionalSections}.
    Include these details as additional accomplishments in the ‘Work Experience’ section: ${formData.keyHighlights}.
    Follow this structure in the output: Contact Details, Professional Summary, Work Experience, Educational Background, Skills, and Additional Section (with relevant sub-category).
    Follow this format for showing the Educational background information: 
    [Degree Type] in [Area of Study]
    [Name of Institution], [Location of Institution]
    [Month Year of Graduation]
    The resume should be well-organized and effectively showcase the educator's strengths, qualifications, and readiness for the potential job, making it compelling for employers.
    It should be tailored according to the job role and job description.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Resume Generator</h2>
            <h3>Create a tailored resume highlighting your teaching experience, skills, and educational background.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="jobRole">Job Role You Will Be Applying For <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="jobRole"
                        onChange={handleInputChange}
                        value={formData.jobRole}
                        placeholder="e.g., Science Teacher in a CBSE School for Secondary Level, Online Teacher for Coding"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="teachingExperience">Five Teaching Experiences (In Reverse Chronology) <span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="teachingExperience"
                        onChange={handleInputChange}
                        value={formData.teachingExperience}
                        placeholder="Mention each position's School Name, Designation, and Duration. For Example:
Don Bosco School (Coordinator 2022-Present)
Army Public School (English Teacher 2020-2022)
Delhi Public School (English Teacher 2018-2020)"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="educationalBackground">Educational Background (In Reverse Chronology)</label>
                    <textarea
                        className="form-control"
                        name="educationalBackground"
                        onChange={handleInputChange}
                        value={formData.educationalBackground}
                        placeholder="List your Degrees, Area of Study, Name of Institution, Location of Institution, Month Year of Graduation. For Example:
Master of Commerce in Accountancy from the University of Calcutta, Kolkata (June 2018)
Bachelor of Education from WBUTTEPA, Kolkata (June 2016)
Bachelor of Commerce in Accountancy from the University of Calcutta, Kolkata (June 2014)"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="skills">Skills</label>
                    <input
                        className="form-control"
                        name="skills"
                        onChange={handleInputChange}
                        value={formData.skills}
                        placeholder="Specific skills that you want to be included (e.g., Curriculum Development, Classroom Management, Technological Proficiency, Instructional Design)"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="additionalSections">Additional Sections</label>
                    <textarea
                        className="form-control"
                        name="additionalSections"
                        onChange={handleInputChange}
                        value={formData.additionalSections}
                        placeholder="Certifications, Projects, Publications, Achievements, Awards or Recognitions, Languages, Interests/ Hobbies, Professional Development Activities. For Example:
Certifications- Microsoft, and Google Certified Educator,
Hobby- Reading books,
Languages known- Hindi, English, Bengali"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="keyHighlights">Key Highlights</label>
                    <textarea
                        className="form-control"
                        name="keyHighlights"
                        onChange={handleInputChange}
                        value={formData.keyHighlights}
                        placeholder="List the key highlights that you want to be included in Work Experience. For Example:
Grades taught are 9 to 12 in Don Bosco School,
Conducted VR and AR tours for students in Army Public School,
Coordinated school-wide Literacy Initiatives in Delhi Public School"
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ResumeGenerator;