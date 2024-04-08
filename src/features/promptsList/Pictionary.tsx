import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const Pictionary = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        ageGroup: '',
        categoryTopicSubject: '',
        difficultyLevel: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 15 Pictionary words for the ${formData.ageGroup} age group in the category of ${formData.categoryTopicSubject} at ${formData.difficultyLevel} difficulty level.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Pictionary</h2>
            <h3>Generate a list of words suitable for playing Pictionary.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ageGroup">Age Group<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="ageGroup"
                        onChange={handleInputChange}
                        value={formData.ageGroup}
                    >
                        <option value="Kids">Kids</option>
                        <option value="Teens">Teens</option>
                        <option value="Adults">Adults</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="categoryTopicSubject">Category/Topic/Subject<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="categoryTopicSubject"
                        onChange={handleInputChange}
                        value={formData.categoryTopicSubject}
                        placeholder="e.g., Animals, Objects, Actions, Digestive System, Environmental Studies"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="difficultyLevel">Difficulty Level<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="difficultyLevel"
                        onChange={handleInputChange}
                        value={formData.difficultyLevel}
                    >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default Pictionary;
