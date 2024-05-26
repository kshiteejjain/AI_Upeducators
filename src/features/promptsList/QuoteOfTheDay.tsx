import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const QuoteOfTheDay = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        topic: '',
        tone: '',
        audience: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate 5 ${formData.tone} 'Quote of the Day' suggestions on the topic of ${formData.topic}. Ensure the quotes are engaging and relevant. It should be suitable for a ${formData.audience} audience.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Quote of the Day</h2>
            <h3>Generate 'Quote of the Day' suggestions based on any topic.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topic"> Topic
                        <span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="e.g., Teamwork, Self-discipline, Innovation, The Magic of Numbers, Climate Change, Cultural Diversity"
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='tone'> Tone </label>
                    <select
                        className='form-control'
                        name="tone"
                        onChange={handleInputChange}
                        value={formData.tone}>
                        <option value="">Choose the tone that best suits your audience and context</option>
                        <option value="Inspirational">Inspirational</option>
                        <option value="Humorous">Humorous</option>
                        <option value="Motivational">Motivational</option>
                        <option value="Thought-Provoking">Thought-Provoking</option>
                        <option value="Philosophical">Philosophical</option>
                        <option value="Optimistic">Optimistic</option>
                        <option value="Light-hearted">Light-hearted</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="audience"> Audience </label>
                    <input
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="e.g., Children, Teenagers, Adults, Mixed Age Groups, Working Professionals"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};
export default QuoteOfTheDay;
