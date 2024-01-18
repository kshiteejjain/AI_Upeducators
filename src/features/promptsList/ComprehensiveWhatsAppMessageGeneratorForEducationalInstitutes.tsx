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


const ComprehensiveWhatsAppMessageGeneratorForEducationalInstitutes = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        instituteName: '',
        audience: '',
        purpose: 'Course Promotion',
        keyAttraction: '',
        highlights: '',
        courseEventName: '',
        dateTime: '',
        callToAction: '',
        urgencyElement: '',
        additionalDetails: '',
        characterCount: ''
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
            const promptMessage = `Generate a comprehensive WhatsApp message for ${formData.instituteName} targeting ${formData.audience} about ${formData.purpose}, emphasizing ${formData.keyAttraction} and Highlights:${formData.highlights}. Include Course/Event Name as ${formData.courseEventName} and Date and Time as ${formData.dateTime} if applicable. The message should have a compelling call to action: ${formData.callToAction}. Add an Urgency Element:${formData.urgencyElement} to create immediacy and include Additional Details: ${formData.additionalDetails} if necessary. Ensure the message is concise, not exceeding ${formData.characterCount} characters.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Comprehensive WhatsApp Message Generator for Educational Institutes</h2>
            <h3>Craft WhatsApp messages with high engagement potential, tailored for educational institutes to effectively communicate with students, parents, or educators.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='instituteName'>Institute Name <span className='asterisk'>*</span></label>
                    <input className='form-control' name='instituteName' onChange={handleInputChange} value={formData.instituteName} placeholder='Enter the name of your educational institute. This will add credibility and recognition to your message.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Enter the target audience for the message. Tailor your message to their specific interests and needs.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='purpose'> Purpose</label>
                    <select className='form-control' name="purpose" onChange={handleInputChange} value={formData.purpose}>
                    <option value="coursePromotion">Course Promotion</option>
                    <option value="eventInvitation">Event Invitation</option>
                    <option value="educationalTip">Educational Tip</option>
                    <option value="scholarshipInformation">Scholarship Information</option>
                    <option value="enrollmentReminder">Enrollment Reminder</option>
                    <option value="seasonalGreeting">Seasonal Greeting</option>
                    <option value="feedbackRequest">Feedback Request</option>
                    <option value="generalUpdate">General Update</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keyAttraction'>Key Attraction</label>
                    <input required className='form-control' name='keyAttraction' onChange={handleInputChange} value={formData.keyAttraction} placeholder='Enter a key attraction or unique benefit (like a discount, special guest, or exclusive opportunity). This should be a focal point to grab attention.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='highlights'>Highlights</label>
                    <input required className='form-control' name='highlights' onChange={handleInputChange} value={formData.highlights} placeholder='Enter a key attraction or unique benefit (like a discount, special guest, or exclusive opportunity). This should be a focal point to grab attention.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseEventName'>Course/Event Name</label>
                    <input required className='form-control' name='courseEventName' onChange={handleInputChange} value={formData.courseEventName} placeholder='Enter a key attraction or unique benefit (like a discount, special guest, or exclusive opportunity). This should be a focal point to grab attention.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='dateTime'>Date and Time</label>
                    <input required className='form-control' name='dateTime' onChange={handleInputChange} value={formData.dateTime} placeholder='Specify the date and time for the event or the course start, if relevant.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='callToAction'>Call to Action</label>
                    <input required className='form-control' name='callToAction' onChange={handleInputChange} value={formData.callToAction} placeholder='Enter a clear, compelling call to action, like "Register Now", "Learn More", etc. This should encourage immediate response.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='urgencyElement'>Urgency Element</label>
                    <input required className='form-control' name='urgencyElement' onChange={handleInputChange} value={formData.urgencyElement} placeholder='Add an element of urgency or scarcity, like "limited seats", "offer ends soon", to prompt quick action.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalDetails'> Additional Details</label>
                    <textarea required className='form-control' name='additionalDetails' rows={5} onChange={handleInputChange} value={formData.additionalDetails} placeholder='Include any extra information or details that might be relevant or beneficial to the message. This could be logistical information, contact details, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='characterCount'> Character Count</label>
                    <input required className='form-control' name='characterCount' onChange={handleInputChange} value={formData.characterCount} placeholder='Specify the maximum number of characters for the message. Keep it concise for better engagement.' />
                </div>
               
                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default ComprehensiveWhatsAppMessageGeneratorForEducationalInstitutes;