import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ClassroomRulesAndExpectations = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        gradeLevel: '',
        behaviorFocus: '',
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
    const promptMessage = `Generate 8 Classroom Rules and 8 Expectations (with short descriptions) for ${formData.gradeLevel} students. The rules/expectations should primarily focus on this Behavior Focus/Specific Issues: ${formData.behaviorFocus}. 
    Also consider these additional details in the output: ${formData.additionalDetails}
    Suggest ways to bring the required change through class activities.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    return (
        <div className="generator-section">
            <h2>Classroom Rules and Expectations</h2>
            <h3>Establish clear rules and expectations to foster a positive classroom environment.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='gradeLevel'>Grade Level
                        <span className="asterisk">*</span></label>
                    <select
                        required
                        className='form-control'
                        name="gradeLevel"
                        onChange={handleInputChange}
                        value={formData.gradeLevel}
                        placeholder="Select the educational level of the classroom.">
                        <option value="">Select the educational level</option>
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

                <div className='form-group'>
                    <label htmlFor='behaviorFocus'>Behavior Focus/Specific Issues
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className='form-control'
                        name="behaviorFocus"
                        onChange={handleInputChange}
                        value={formData.behaviorFocus}
                        placeholder="e.g., Respect, Responsibility, Honesty, Bullying, Tardiness" />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalDetails'>Additional Details</label>
                    <textarea
                        className='form-control'
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="For Example-
Rule Enforcement Method (e.g., Positive Reinforcement, Consequences, Both)
Participation (e.g., Teacher-Set, Student-Involved, Both)
Review Frequency (e.g., Daily, Weekly, Monthly)
Any other additional expectations for your classroom">
                    </textarea>
                </div>


                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default ClassroomRulesAndExpectations;
