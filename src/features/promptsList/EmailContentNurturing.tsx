import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EmailContentNurturing = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        emailSubject: '',
        audience: '',
        additionalDetails: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const promptMessage = `Email Headline ${formData.emailSubject}. Convert this headline into a 125 word email. Audience of the email is ${formData.audience}. Be to the point. Use short sentences and short paragraphs. Have a powerful intro in your email, with a hook, so people read further. Don't just use content from the system prompt. Use anything that you think the reader will appreciate. Give what is promised in the email headline in the email itself and don't use that as a hook to get people to buy. 80% of the content should add value, and 20% points them towards signing up or registration. In the email, Also Include these points flawlessly: ${formData.additionalDetails}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Email Content: Nurturing</h2>
            <h3>Generate effective email content on the basis of lead nurturing ideas.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='emailSubject'>Email Subject <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='emailSubject'
                        onChange={handleInputChange}
                        value={formData.emailSubject}
                        placeholder='Enter the Email Subject'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='audience'
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder='Enter the target audience, such as Parents, Teenagers'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details </label>
                    <textarea
                        className='form-control'
                        name='additionalDetails'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.additionalDetails}
                        placeholder='Write any details you want to add in email'
                    ></textarea>
                </div>
                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default EmailContentNurturing;
