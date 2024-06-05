import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ThankYouNote = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        relationship: '',
        reason: '',
        length:'',
        specialDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a customized thank you note for my ${formData.relationship} for ${formData.reason}.
    The note should be ${formData.length} in length and include these special details: ${formData.specialDetails}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Thank You Note</h2>
            <h3>Create thank you notes to express your gratitude.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="relationship"> Relationship
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="relationship"
                        onChange={handleInputChange}
                        value={formData.relationship}
                        placeholder="e.g., Family Member, Friend, Colleague, Teacher, Mentor"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reason"> Reason
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="reason"
                        onChange={handleInputChange}
                        value={formData.reason}
                        placeholder="e.g., birthday gift, farewell, support during a project"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="length">Length</label>
                    <select className="form-control" name="length" onChange={handleInputChange} value={formData.length}>
                        <option value="">Choose the desired length of the note.</option>
                        <option value="Short (25-50 words)">Short (25-50 words)</option>
                        <option value="Medium (50-75 words)">Medium (50-75 words)</option>
                        <option value="Long (75-100 words)">Long (75-100 words)</option>
                        <option value="Very Long (100-150 words)">Very Long (100-150 words)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="specialDetails">Special Details</label>
                    <textarea
                        required
                        className="form-control"
                        name="specialDetails"
                        onChange={handleInputChange}
                        value={formData.specialDetails}
                        placeholder="A brief statement or any detail you want to be included in the note."
                        rows={5}
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default ThankYouNote;
