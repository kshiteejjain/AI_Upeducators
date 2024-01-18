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


const AutomatedCourseLandingPageContentGeneratorWithSeo = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);


    const [formData, setFormData] = useState({
        courseTitle: '',
        SEOKeywords: '',
        keyBenefit: '',
        courseDescription: '',
        learningOutcomes: '',
        targetAudience: '',
        courseFormat: '',
        duration: '',
        instructorDetails: '',
        pricing: '',
        specialOffersDiscounts: ''
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
            const promptMessage = `Generate a comprehensive, detailed, and engaging course landing page titled ${formData.courseTitle}. The content will cover a captivating course description ${formData.courseDescription}, in-depth learning outcomes ${formData.learningOutcomes}, a clear depiction of the target audience ${formData.targetAudience}, a vivid description of the course format ${formData.courseFormat}, precise duration details ${formData.duration}, an engaging introduction to the instructor(s) ${formData.instructorDetails}, transparent pricing information ${formData.pricing}, and enticing special offers or discounts ${formData.specialOffersDiscounts}. Throughout the content, strategically placed and aptly phrased CTA buttons will be included to guide potential students towards engagement and action. SEO keywords ${formData.SEOKeywords} will be seamlessly integrated for enhanced online visibility.`

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Automated Course Landing Page Content Generator with SEO</h2>
            <h3>Create an informative and engaging course landing page. The generated content will automatically include strategically placed and appropriately worded CTA buttons for optimal engagement and conversion.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='courseTitle'>Course Title <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseTitle' onChange={handleInputChange} value={formData.courseTitle} placeholder='Enter the full title of the course.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='SEOKeywords'>SEO Keywords <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='SEOKeywords' onChange={handleInputChange} value={formData.SEOKeywords} placeholder='List relevant SEO keywords for optimal search engine visibility.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='keyBenefit'>Key Benefit <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='keyBenefit' onChange={handleInputChange} value={formData.keyBenefit} placeholder='Describe a key benefit or outcome of the course, for example, "build complex applications" or "master data analysis".' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseDescription'>Course Description <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='courseDescription' onChange={handleInputChange} rows={5} value={formData.courseDescription} placeholder='Provide a detailed, captivating overview of the course.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='learningOutcomes'>Learning Outcomes <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='learningOutcomes' onChange={handleInputChange} value={formData.learningOutcomes} placeholder='Detail the specific skills and knowledge students will gain.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='targetAudience'>Target Audience <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='targetAudience' onChange={handleInputChange} value={formData.targetAudience} placeholder='Describe the ideal student profile for this course.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='courseFormat'>Course Format <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='courseFormat' onChange={handleInputChange} value={formData.courseFormat} placeholder='Explain the structure of the course and the mode of delivery.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='duration'> Duration <span className='asterisk'>*</span> </label>
                    <select required className='form-control' name="duration" onChange={handleInputChange} value={formData.duration}>
                        <option value="seconds"> Seconds</option>
                        <option value="minutes">Minutes</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='instructorDetails'>Instructor Details <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='instructorDetails' onChange={handleInputChange} value={formData.instructorDetails} placeholder='Provide background information on the instructor(s).' />
                </div>  
                <div className='form-group'>
                    <label htmlFor='pricing'>Pricing <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='pricing' onChange={handleInputChange} value={formData.pricing} placeholder='Provide detailed pricing information.' />
                </div>  
                <div className='form-group'>
                    <label htmlFor='specialOffersDiscounts'>Special Offers or Discounts <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='specialOffersDiscounts' onChange={handleInputChange} value={formData.specialOffersDiscounts} placeholder='Describe any current promotions or discounts.' />
                </div>  
                

                <Button title='Generate' type="submit" />

                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default AutomatedCourseLandingPageContentGeneratorWithSeo;