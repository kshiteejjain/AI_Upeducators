import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ProjectBasedLearning = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        projectTitle: '',
        gradeLevel: '',
        subjectArea: '',
        additionalDetails: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a full project plan for a PBL activity. The project is for ${formData.gradeLevel} and should consider this Topic / Subject / Learning Objectives: ${formData.subjectArea}. 
    Also consider these additional details: ${formData.additionalDetails}.
    Follow this structure in the output: Project Title, Duration, Learning Objectives, Materials/Resources, Duration wise detailed Project Plan (along with the plan description), Assessment Criteria, Support Strategies, Reflection. 
    In case you want to add something else in the structure to make it better, then you can do it.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Project Based Learning</h2>
            <h3>Create a project plan to implement Project-Based Learning (PBL).</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='projectTitle'> Project Title <span className='asterisk'>*</span> </label>
                    <input required className='form-control' name='projectTitle' onChange={handleInputChange} value={formData.projectTitle} placeholder='Enter a brief title for the project.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'> Grade Level <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="gradeLevel" onChange={handleInputChange} value={formData.gradeLevel}>
                        <option value="">Select the grade level for which the project is intended.</option>
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
                <div className='form-group'>
                    <label htmlFor='subjectArea'> Topic / Subject / Learning Objectives  <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="subjectArea" onChange={handleInputChange} value={formData.subjectArea}>
                        {/* Options for Subject Area */}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <textarea className="form-control" name="additionalDetails" onChange={handleInputChange} value={formData.additionalDetails} placeholder="e.g., Project Duration, Student Activities, Special Instructions, Learning Environment, Collaboration Level"></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ProjectBasedLearning;
