import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const IdentifyNiche = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        courseSkillName: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I want to start ${formData.courseSkillName}. Please give me 10 niche ideas to start my classes with 10 word description in each idea`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
    };
    return (
        <div className="generator-section">
            <h2>Identify Niche</h2>
            <h3> Generate niche ideas for your services.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="courseSkillName">Course/Skill name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="courseSkillName"
                        onChange={handleInputChange}
                        value={formData.courseSkillName}
                        placeholder="Eg. maths classes for kids, dance classes for kids"
                    />
                </div>
                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default IdentifyNiche;
