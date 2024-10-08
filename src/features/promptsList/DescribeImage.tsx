import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt, resetGeneratedData } from '../promptListGeneratorSlice/DescribeImageSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
import Loader from '../../components/loader/Loader';

const DescribeImage = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    
    // Initial form data state
    const getInitialFormData = () => ({
        image: '',
        instructions: ''
    });
    
    const [formData, setFormData] = useState(getInitialFormData);
    const [loader, setLoader] = useState(false);

    // Handle input changes for instructions
    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const promptMessage = [{
        promptMsg: `${formData.instructions}`,
        imageURL: `${formData.image}`
    }];

    // Handle form submission
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    // Handle file upload, convert to Base64, and update form data
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(resetGeneratedData());
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader(); // Create a FileReader to read the file
            reader.onloadend = async () => {
                // After reading the file, set the Base64 string to the formData
                setFormData((prevData) => ({
                    ...prevData,
                    image: reader.result as string, // Set the Base64 result as image URL
                }));
                setLoader(false);
            };
            reader.onerror = () => {
                console.error('Error reading file');
                setLoader(false);
            };

            setLoader(true); // Start loader while processing
            reader.readAsDataURL(file); // Read file as a data URL (Base64)
        }
    };
    
    return (
        <div className="generator-section">
            {loader && <Loader />}
            <h2>Describe Image</h2>
            <h3>Upload the image and get a description.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image">Upload Image<span className="asterisk">*</span></label>
                    <input
                        type='file'
                        className="form-control"
                        name="image"
                        onChange={handleFileUpload}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions<span className="asterisk">*</span></label>
                    <textarea
                        className="form-control"
                        name="instructions"
                        onChange={handleInputChange}
                        value={formData.instructions}
                        placeholder='Enter Instructions'
                        rows={5}
                    />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    );
};

export default DescribeImage;
