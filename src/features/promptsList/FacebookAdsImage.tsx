import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const DesignFacebookAdsCreative = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        adHeadline: '',
        callToAction: '',
        audience: '',
        additionalDetails: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Design an image with headline ${formData.adHeadline}. CTA button will be ${formData.callToAction}. Audience is ${formData.adHeadline}. Add relevant image to grab attention and make more conversions. Additional details: ${formData.additionalDetails}. Don't add any text other than headline and CTA given. Dimensions will be 1080*1080. Give clear image that I can directly add on ad platform.`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Facebook Ads Image</h2>
            <h3>Design image for your facebook ad.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="adHeadline">Ad Headline<span className="asterisk">*</span></label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        name="adHeadline"
                        onChange={handleInputChange}
                        value={formData.adHeadline}
                        placeholder="Eg. Join the Best Yoga Classes for Kids, Learn Data Science"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="callToAction">Call to Action</label>
                    <input
                        type="text"
                        className="form-control"
                        name="callToAction"
                        onChange={handleInputChange}
                        value={formData.callToAction}
                        placeholder="Eg. Enroll now, Register Now, Join now, Sign up, Learn more"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="audience">Audience</label>
                    <input
                        type="text"
                        className="form-control"
                        name="audience"
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder="Eg. Parents, students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <input
                        type="text"
                        className="form-control"
                        name="additionalDetails"
                        onChange={handleInputChange}
                        value={formData.additionalDetails}
                        placeholder="Eg. Add classroom background, add students"
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default DesignFacebookAdsCreative;
