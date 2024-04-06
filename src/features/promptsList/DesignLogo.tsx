import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const DesignLogo = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        instituteName: '',
        serviceDescription: '',
        mainFocusInLogo: '',
        instituteTagline: '',
        showInstituteNameInLogo: '',
        colorsToUseInLogo: '',
        logoStyle: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Design a logo for a company ${formData.instituteName} who ${formData.serviceDescription}. Logo should focus on ${formData.mainFocusInLogo}. Add a tagline as ${formData.instituteTagline}. ${formData.instituteName} company name written in the logo. Logo should have [${formData.colorsToUseInLogo} color. give logo that I can directly use, ${formData.logoStyle}`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Design Logo</h2>
            <h3>Design a Logo for your classes</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="instituteName">Institute name <span className="asterisk">*</span></label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        name="instituteName"
                        onChange={handleInputChange}
                        value={formData.instituteName}
                        placeholder="Eg. Knowledge Academy, Megha classes"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="serviceDescription">Service description <span className="asterisk">*</span></label>
                    <input
                        required
                        type="text"
                        className="form-control"
                        name="serviceDescription"
                        onChange={handleInputChange}
                        value={formData.serviceDescription}
                        placeholder="Eg. gives tuition to 6th to 8th class students"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mainFocusInLogo">Main focus in logo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="mainFocusInLogo"
                        onChange={handleInputChange}
                        value={formData.mainFocusInLogo}
                        placeholder="Eg. student reading books"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="instituteTagline">Institute’s tagline</label>
                    <input
                        type="text"
                        className="form-control"
                        name="instituteTagline"
                        onChange={handleInputChange}
                        value={formData.instituteTagline}
                        placeholder="Eg. Knowledge is wisdom, Elevate your learning"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="showInstituteNameInLogo">Show Institute name in logo<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="showInstituteNameInLogo"
                        onChange={handleInputChange}
                        value={formData.showInstituteNameInLogo}
                    >
                        <option value="show">Show</option>
                        <option value="dontShow">Don’t show</option>
                    </select>
                </div>


                <div className="form-group">
                    <label htmlFor="colorsToUseInLogo">Colors to use in logo</label>
                    <input
                        type="text"
                        className="form-control"
                        name="colorsToUseInLogo"
                        onChange={handleInputChange}
                        value={formData.colorsToUseInLogo}
                        placeholder="Eg. Brown"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="logoStyle">Logo style</label>
                    <input
                        type="text"
                        className="form-control"
                        name="logoStyle"
                        onChange={handleInputChange}
                        value={formData.logoStyle}
                        placeholder="Eg. realistic, professional"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default DesignLogo;