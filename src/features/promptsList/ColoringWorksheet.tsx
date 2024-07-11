import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/ImageGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const ColoringWorksheet = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        ageGroup: '',
        themeShortDescription: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create an easy and basic outlined coloring page suitable for ${formData.ageGroup} children. Consider this theme/short description for the Colouring Page: ${formData.themeShortDescription}. The coloring page should be appropriate for the selected age group of the children and the theme.
    Ensure that the coloring page is elementary for the selected age group and not complex.`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Coloring Worksheet</h2>
            <h3>Create custom coloring worksheets tailored for children's educational and recreational needs.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ageGroup">Age Group<span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="ageGroup"
                        onChange={handleInputChange}
                        value={formData.ageGroup}
                    >
                        <option value="Toddlers">Toddlers (1-3 years)</option>
                        <option value="Preschool">Preschool (3-5 years)</option>
                        <option value="EarlyElementary">Early Elementary (5-7 years)</option>
                        <option value="LateElementary">Late Elementary (7-10 years)</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="themeShortDescription">Theme or Short Description<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="themeShortDescription"
                        onChange={handleInputChange}
                        value={formData.themeShortDescription}
                        placeholder="e.g., Space, Fairy Tales, Unicorns in a Forest, Kids playing in a park"
                    />
                </div>


                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default ColoringWorksheet;