import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt, resetGeneratedData } from '../promptListGeneratorSlice/DescribeImageSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
import Loader from '../../components/loader/Loader';

const DescribeImage = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        image: '',
        instructions: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const [loader, setLoader] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = [{
        promptMsg: `${formData.instructions}`,
        imageURL: `${formData.image}`
    }]

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        dispatch(resetGeneratedData())
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                setLoader(true);
                const response = await fetch(`${import.meta.env.VITE_FILE_UPLOAD_API_KEY}`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log(result?.fileUrl); // Assuming the URL is in the response
                    setFormData((prevData) => ({
                        ...prevData,
                        image: result?.fileUrl,
                    }));
                    setLoader(false);
                } else {
                    console.error('File upload failed');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
            }
        }
    };
    
    return (
        <div className="generator-section">
             {loader && <Loader />}
            <h2>Describe Image </h2>
            <h3>Upload the image and get description.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image">Upload Image <span className="asterisk">*</span></label>
                    <input
                        type='file'
                        className="form-control"
                        name="image"
                        onChange={handleFileUpload}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions <span className="asterisk">*</span></label>
                    <textarea
                        className="form-control"
                        name="instructions"
                        onChange={handleInputChange}
                        value={formData.instructions}
                        placeholder='Enter Instructions'
                        rows={5}
                    >
                    </textarea>
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default DescribeImage;