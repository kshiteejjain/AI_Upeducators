import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const PresentationContent = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        gradeLevel: '',
        topic: '',
        additionalDetails: '',
        additionalNotes: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate slide-wise detailed Presentation content suitable for ${formData.gradeLevel} students on the topic of ${formData.topic}. The presentation should consider these additional details: ${formData.additionalDetails}. 
    The content should be made engaging with Hooks, Fun Facts, Interactive Elements, and Visual and Multi-media elements`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Presentation Content</h2>
            <h3>Generate engaging content for your Presentations.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name='gradeLevel'
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                    >
                        <option value="Nursery">Nursery</option>
                        <option value="Preparatory">Preparatory</option>
                        <option value="1stGrade">1st Grade</option>
                        <option value="2ndGrade">2nd Grade</option>
                        <option value="3rdGrade">3rd Grade</option>
                        <option value="4thGrade">4th Grade</option>
                        <option value="5thGrade">5th Grade</option>
                        <option value="6thGrade">6th Grade</option>
                        <option value="7thGrade">7th Grade</option>
                        <option value="8thGrade">8th Grade</option>
                        <option value="9thGrade">9th Grade</option>
                        <option value="10thGrade">10th Grade</option>
                        <option value="11thGrade">11th Grade</option>
                        <option value="12thGrade">12th Grade</option>
                        <option value="CollegeLevel">College Level</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="topic">Topic <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Renewable Energy Sources, Modern Teaching Methods, The French Revolution"
                    />
                </div>


                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        rows={5}
                        placeholder='e.g., Key Focus or Theme of the presentation, Number of Slides, Specific Presentation Type, Duration, Any other details'
                    ></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default PresentationContent;
