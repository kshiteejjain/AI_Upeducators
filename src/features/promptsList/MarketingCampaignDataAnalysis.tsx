import { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';
const MarketingCampaignDataAnalysis = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        enterData: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `This is the data of my facebook campaign, pls do the analysis of this data and suggest me  which campaign / ad set i should stop or i increase the budget, Pls give me the suggestions in points ${formData.enterData}`;
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
       setFormData(getInitialFormData);
    };
    return (
        <div className="generator-section">
            <h2>Facebook Marketing Campaign Data Analysis</h2>
            <h3>Find insights about your campaign and suggestions to improve performance.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='enterData'>Enter Your Data <span className='asterisk'>*</span></label>
                    <textarea
                        required
                        type='text'
                        className='form-control'
                        name='enterData'
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.enterData}
                        placeholder='Enter the data you want to analyze/Paste the data table'
                    />
                </div>
                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default MarketingCampaignDataAnalysis;
