import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/DescribeImageSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const DescribeImage = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        image: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const [file, setFile] = useState();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `${formData.image}`

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('isGPT4', 'true');
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    
    return (
        <div className="generator-section">
            <h2>Describe Image </h2>
            <h3>Upload the image and get description.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="image">Upload Image <span className="asterisk">*</span></label>
                    <input
                        type='file'
                        className="form-control"
                        name="image"
                        onChange={handleInputChange}
                        value={formData.image}
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