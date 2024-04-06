import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const MemeImage = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        memeIdea: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a meme image that shows ${formData.memeIdea}`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Meme Image</h2>
            <h3>Generate image for the meme idea</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="memeIdea">Meme idea<span className="asterisk">*</span></label>
                    <textarea
                        required
                        className="form-control"
                        name="memeIdea"
                        onChange={handleInputChange}
                        value={formData.memeIdea}
                        rows={4}
                        placeholder="Eg. kid struggling to do a yoga pose, Parent trying to explain a science concept to their child"
                    ></textarea>
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default MemeImage;