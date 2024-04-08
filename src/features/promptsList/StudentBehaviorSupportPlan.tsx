import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const StudentBehaviorSupportPlan = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        studentAgeGroup: '',
        behaviourConcern: '',
        additionalInformation: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a Student Behavior Support Plan for a student in ${formData.studentAgeGroup}. Address the behavior concern of ${formData.behaviourConcern}, considering additional Information: ${formData.additionalInformation}.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Student Behavior Support Plan</h2>
            <h3>Generate suggestions for student behavior support plans tailored to student needs and behaviors.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="studentAgeGroup">Student Age Group <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="studentAgeGroup"
                        onChange={handleInputChange}
                        value={formData.studentAgeGroup}
                    >
                        <option value="EarlyChildhood">Early Childhood</option>
                        <option value="Elementary">Elementary</option>
                        <option value="MiddleSchool">Middle School</option>
                        <option value="HighSchool">High School</option>
                        <option value="CollegeLevel">College Level</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="behaviourConcern">Behavior Concern <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="behaviourConcern"
                        onChange={handleInputChange}
                        value={formData.behaviourConcern}
                        placeholder="e.g., inappropriate language or gestures, difficulty focusing, aggressive outbursts, non-compliance with classroom rules, excessive talking or interrupting"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='additionalInformation'>Additional Information</label>
                    <textarea
                        className='form-control'
                        name='additionalInformation'
                        onChange={handleInputChange}
                        value={formData.additionalInformation}
                        rows={5}
                        placeholder='e.g., Family Background, Specific Considerations, Observed Triggers, Current Strategies Used, Desired Outcomes'
                    ></textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default StudentBehaviorSupportPlan;