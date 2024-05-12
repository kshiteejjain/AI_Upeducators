import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const SyllabusGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        subjectArea: '',
        educationalBoard: '',
        courseDuration: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate ${formData.courseDuration} Syllabus for the Subject of ${formData.subjectArea}.
    The grade level is ${formData.gradeLevel} under the ${formData.educationalBoard} board.`;
    
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Syllabus Generator</h2>
            <h3>Create detailed syllabi for any subject area.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="gradeLevel">Grade Level<span className="asterisk">*</span></label>
                    <select required className="form-control" name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the grade level for which the syllabus is being created</option>
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1st-Grade">1st Grade</option>
                        <option value="2nd-Grade">2nd Grade</option>
                        <option value="3rd-Grade">3rd Grade</option>
                        <option value="4th-Grade">4th Grade</option>
                        <option value="5th-Grade">5th Grade</option>
                        <option value="6th-Grade">6th Grade</option>
                        <option value="7th-Grade">7th Grade</option>
                        <option value="8th-Grade">8th Grade</option>
                        <option value="9th-Grade">9th Grade</option>
                        <option value="10th-Grade">10th Grade</option>
                        <option value="11th-Grade">11th Grade</option>
                        <option value="12th-Grade">12th Grade</option>
                        <option value="College-Level">College Level</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subjectArea">Subject Area<span className="asterisk">*</span></label>
                    <input required className="form-control" name="subjectArea" onChange={handleInputChange} value={formData.subjectArea} placeholder="Enter the Subject Area (e.g., Introduction to Biology, Advanced Mathematics)" />
                </div>

                <div className="form-group">
                    <label htmlFor="educationalBoard">Educational Board<span className="asterisk">*</span></label>
                    <select required className="form-control" name="educationalBoard" onChange={handleInputChange} value={formData.educationalBoard}>
                        <option value="">Choose the educational board or system</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="IGCSE">IGCSE</option>
                        <option value="IB">IB</option>
                        <option value="State-Board">State Board</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="courseDuration">Course Duration<span className="asterisk">*</span></label>
                    <input required className="form-control" name="courseDuration" onChange={handleInputChange} value={formData.courseDuration} placeholder="Specify the duration of the course (e.g., 10 weeks, one semester, one year)" />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default SyllabusGenerator;
