import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const AddEmojiInWhatsAppAndEmail = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        addYourContent: '',
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Add emojis to this content wherever feels necessary and increase conversion. Emoji placement should be at the beginning of a sentence generally. ${formData.addYourContent}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Add Emoji in WhatsApp and Email</h2>
            <h3> Add relevant emojis to your content</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='addYourContent'> Add Your Content
                        <span className="asterisk">*</span>
                    </label>
                    <textarea
                        required
                        className='form-control'
                        name='addYourContent'
                        onChange={handleInputChange}
                        value={formData.addYourContent}
                        rows={5}
                        placeholder='Paste the content here'>
                    </textarea>
                </div>


                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default AddEmojiInWhatsAppAndEmail;
