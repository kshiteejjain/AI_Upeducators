import React, { useEffect, useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import Loader from '../../components/loader/Loader';
import { AnyAction } from '@reduxjs/toolkit';

type GeneratorData = {
    status: string;
};

type RootState = {
    target: { name: string; value: string; };
    generatorData: GeneratorData;
    status: string;
    e: Event;
    onChange: () => void;
};


const EmailContentGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        customers: '',
        emailPurpose: 'Marketing',
        audience: '',
        keyMessage: '',
        productService: '',
        callToAction: '',
        additionalNotes: ''
    });


    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const sendPrompt = async (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `Create an email that is targeted at ${formData.customers}, and serves the purpose of ${formData.emailPurpose}. Audience is ${formData.audience}. Ensure the email encompasses the key message ‘${formData.keyMessage}’ about ${formData.productService} and encourages the audience to ${formData.callToAction}. Include any additional points as noted in ${formData.additionalNotes}. The email should be engaging, clear, and aligned with the desired action.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Email Content Generator</h2>
            <h3>Create compelling and effective email content tailored to your audience and specific objectives.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='customers'>Customers <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='customers' onChange={handleInputChange} value={formData.customers} placeholder='Specify your customers for the email, e.g., Existing Customers, Potential Clients.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='emailPurpose'>Email Purpose <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="emailPurpose" onChange={handleInputChange} value={formData.emailPurpose}>
                        <option value="Marketing">Marketing</option>
                        <option value="Informational">Informational</option>
                        <option value="Newsletter">Newsletter</option>
                        <option value="EventInvitation">Event Invitation</option>
                        <option value="Follow-up">Follow-up</option>
                        <option value="Welcome">Welcome</option>
                        <option value="Confirmation">Confirmation</option>
                        <option value="ThankYou">Thank you</option>
                        <option value="Cancellation">Cancellation</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Specify your target audience for the email, e.g., Students, Pare.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='keyMessage'>Key Message <span className='asterisk'>*</span></label>
                    <textarea name="keyMessage" required className='form-control' rows={5} onChange={handleInputChange} value={formData.keyMessage} placeholder="Outline the main message or offer you want to convey in the email, e.g., a special discount, a course announcement, important news update."></textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='productService'>Product/Service <span className='asterisk'>*</span></label>
                    <input name="productService" required className='form-control' onChange={handleInputChange} value={formData.productService} placeholder="Write your product name and describe briefly" />
                </div>
                <div className='form-group'>
                    <label htmlFor='callToAction'> Call to Action (CTA) <span className='asterisk'>*</span></label>
                    <input name="callToAction" required className='form-control' onChange={handleInputChange} value={formData.callToAction} placeholder="Describe the action you want the recipients to take after reading the email, like 'Sign Up', 'Learn More', or 'Buy Now'." />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalNotes'> Additional Notes <span className='asterisk'>*</span></label>
                    <input name="additionalNotes" required className='form-control' onChange={handleInputChange} value={formData.additionalNotes} placeholder="Include any additional instructions or specific points to be covered in the email." />
                </div>
                

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default EmailContentGenerator;