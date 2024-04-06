import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const StudentRecommendationLetter = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        purposeOfRecommendation: '',
        studentName: '',
        studentGender: '',
        relationshipWithStudent: '',
        universityInstitutionDetails: '',
        studentDetails: '',
        textLength: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a detailed letter of recommendation for a student for ${formData.purposeOfRecommendation} in ${formData.textLength} in length. The letter is written by his/her ${formData.relationshipWithStudent}. Consider the details of the institution the letter is addressed to and the Course/Program applied for: ${formData.universityInstitutionDetails}. The gender of the student is ${formData.studentGender} and his/her name is ${formData.studentName}. Also include these additional student details:  ${formData.studentDetails}
    The output should be in the format of a Formal Letter`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Student Recommendation Letter</h2>
            <h3>Generate a personalized letter of recommendation for any Student. </h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='purposeOfRecommendation'> Purpose of Recommendation <span className="asterisk">*</span> </label>
                    <input
                        required
                        className='form-control'
                        name='purposeOfRecommendation'
                        onChange={handleInputChange}
                        value={formData.purposeOfRecommendation}
                        placeholder="e.g., Job Application, Academic Admission, Networking"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='studentName'> Name of the Student <span className="asterisk">*</span> </label>
                    <input
                        required
                        className='form-control'
                        name='studentName'
                        onChange={handleInputChange}
                        value={formData.studentName}
                        placeholder="Enter the name of the Student"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='studentGender'> Student’s Gender <span className="asterisk">*</span> </label>
                    <select required className='form-control' name="studentGender" onChange={handleInputChange} value={formData.studentGender}>
                        <option value="" disabled selected>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='relationshipWithStudent'> Relationship with the Student <span className="asterisk">*</span> </label>
                    <input
                        required
                        className='form-control'
                        name='relationshipWithStudent'
                        onChange={handleInputChange}
                        value={formData.relationshipWithStudent}
                        placeholder="e.g., teacher, supervisor, coordinator, Principal"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='universityInstitutionDetails'> University/Institution and Course/Program Details </label>
                    <input
                        className='form-control'
                        name='universityInstitutionDetails'
                        onChange={handleInputChange}
                        value={formData.universityInstitutionDetails}
                        placeholder="Mention the University/Institution, Course/Program applied for."
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='studentDetails'> Student Details <span className="asterisk">*</span> </label>
                    <textarea
                        required
                        className='form-control'
                        name='studentDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.studentDetails}
                        placeholder='e.g., Key Achievements, Awards, Recognitions, Character Traits, Abilities, Closing Remarks, Specific examples or stories'>
                    </textarea>
                </div>

                <div className='form-group'>
                    <label htmlFor='textLength'> Text Length <span className="asterisk">*</span> </label>
                    <select required className='form-control' name="textLength" onChange={handleInputChange} value={formData.textLength}>
                        <option value="" disabled selected>Choose the desired length of the letter</option>
                        <option value="Short">Short (up to 200 words)</option>
                        <option value="Medium">Medium (200-400 words)</option>
                        <option value="Long">Long (400-600 words)</option>
                        <option value="Very-Long">Very Long (600-800 words)</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default StudentRecommendationLetter;
