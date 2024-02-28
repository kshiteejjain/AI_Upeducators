import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const BrochureContentGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        businessInstitutionName: '',
        skillService: '',
        targetAudience: '',
        usp: '',
        toneOfVoice: 'Professional',
        additionalInformation: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create brochure content for ${formData.businessInstitutionName} focusing on ${formData.skillService}. The content should appeal to ${formData.targetAudience} and highlight Unique Selling Points as ${formData.usp}. Maintain a ${formData.toneOfVoice} tone and include ${formData.additionalInformation} as needed.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Brochure Content Generator</h2>
            <h3>Generate engaging and informative content for brochures on various topics, skills, and services.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='businessInstitutionName'>Business/Institution Name <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='businessInstitutionName' onChange={handleInputChange} value={formData.businessInstitutionName} placeholder='Enter the name of your business or institution.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='skillService'>Skill/Service <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='skillService' onChange={handleInputChange} value={formData.skillService} placeholder='Describe the main skill or service you want to highlight in the brochure.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Specify your target audience, such as families, professionals, students, etc.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='usp'>Unique Selling Points <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='usp' onChange={handleInputChange} value={formData.usp} placeholder='List key features or unique selling points of your skill/service.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='toneOfVoice'> Tone of Voice <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="toneOfVoice" onChange={handleInputChange} value={formData.toneOfVoice}>
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="informative">Informative</option>
                        <option value="persuasive">Persuasive</option>
                        <option value="casual">Casual</option>
                        <option value="inspirational">Inspirational</option>
                        <option value="authoritative">Authoritative</option>
                        <option value="playful">Playful</option>
                        <option value="educational">Educational</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalInformation'>Additional Information <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='additionalInformation' onChange={handleInputChange} rows={5} value={formData.additionalInformation} placeholder='Include any additional information like history, achievements, testimonials, etc.'> </textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default BrochureContentGenerator;