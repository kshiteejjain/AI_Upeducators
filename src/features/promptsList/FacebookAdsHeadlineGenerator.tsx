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


const FacebookAdsHeadlineGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        audience: '',
        productService: '',
        uniqueSellingPoint: '',
        emotionalAppeal: 'Inspirational',
        numberOfHeadlines: '5',
        keywords: '',
        additionalPoints: '',
        numberOfCharacters: '5',
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
            const promptMessage = `Generate ${formData.numberOfHeadlines} headline ideas for a Facebook ad targeting ${formData.audience}, promoting ${formData.productService} with its USP ${formData.uniqueSellingPoint}. Ensure the headlines capture a ${formData.emotionalAppeal} tone, incorporate ${formData.keywords} where relevant, and consider  ${formData.additionalPoints}. Each headline should be compelling, concise, and ideally within ${formData.numberOfCharacters} characters to maximize engagement and readability on Facebook.            `

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Facebook Ads Headline Generator</h2>
            <h3>Generate catchy and effective headlines for Facebook advertisements, specifically tailored to your campaign’s target audience and objectives.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='audience' onChange={handleInputChange} value={formData.audience} placeholder='Identify the target audience for your ad, such as Millennials, Entrepreneurs, or Outdoor Enthusiasts.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='productService'>Product/Service <span className='asterisk'>*</span></label>
                    <input name="productService" required className='form-control' onChange={handleInputChange} value={formData.productService} placeholder="Briefly describe the product or service being advertised." />
                </div>

                <div className='form-group'>
                    <label htmlFor='uniqueSellingPoint'>Unique Selling Point (USP) <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='uniqueSellingPoint' rows={5} onChange={handleInputChange} value={formData.uniqueSellingPoint} placeholder='Define the main selling point or unique feature of your product/service, like "Affordable Fee", "Best Faculty", "24*7 Support"'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='emotionalAppeal'>Emotional Appeal <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="emotionalAppeal" onChange={handleInputChange} value={formData.emotionalAppeal}>
                        <option value="Inspirational">Inspirational</option>
                        <option value="Humorous">Humorous</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Nostalgic">Nostalgic</option>
                        <option value="Informative">Informative</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='numberOfHeadlines'>Number of Headlines <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="numberOfHeadlines" onChange={handleInputChange} value={formData.numberOfHeadlines}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='keywords'> Keywords <span className='asterisk'>*</span></label>
                    <input name="keywords" required className='form-control' onChange={handleInputChange} value={formData.keywords} placeholder="List any specific keywords for SEO or branding that should be included in the headlines." />
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalPoints'>Additional Points <span className='asterisk'>*</span></label>
                    <input name="additionalPoints" required className='form-control' onChange={handleInputChange} value={formData.additionalPoints} placeholder="Provide any additional instructions or elements to be considered in the headlines." />
                </div>
                <div className='form-group'>
                    <label htmlFor='numberOfCharacters'>Number of characters or range of characters <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="numberOfCharacters" onChange={handleInputChange} value={formData.numberOfCharacters}>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                    </select>
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default FacebookAdsHeadlineGenerator;