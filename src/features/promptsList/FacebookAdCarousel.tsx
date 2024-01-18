import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
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

const FacebookAdCarousel = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');


    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    
    const [formData, setFormData] = useState({
        courseName: '',
        audience: '',
        cta: ''
    });

    const dispatchThunk = useDispatch<ThunkDispatch<RootState, undefined, AnyAction>>();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const sendPrompt = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const promptMessage = `I need help to create carousel ads. Topic is ${formData.courseName}. Audience is ${formData.audience}. Call to Action is ${formData.cta}

            Each slide in this carousel ad has one headline and one description.
            
            Slide 1 Should make people curious, shock or provocate them into swiping right
            
            Slide 2 should be a hook that builds on Slide 1 talks about the problem or about a myth
            
            Slide 3 Should empathise with their problem or debunk the myth with the truth
            
            Slide 4 List one or two myths they believe and tell them why
            
            Slide 5: Introduce a "What if" there was an easy solution
            
            Slide 6: Introduce the coach and their credentials on why they are best suited to help "Hi I'm "
            
            Slide 7: Say what the coach will help you achieve or become "I will help you become a"
            
            Slide 8: Talk about the USPs of the membership program "With our unique programs"
            
            Slide 9: Stress benefits they want as clear goals of the membership " If you want to be able to..."
            
            Slide 10: Call to action
            
            Each headline can be 10 words max
            
            Each description can be upto 15 words
            
            Can you give me slides that reads like a story from one slide to another each with a headline and a description. 
            
            The headlines should connect like as if it were a story
            
            The content should spur people into action`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Facebook Ad: Carousel</h2>
            <h3>Create dynamic and appealing content for Facebook ad carousels, tailored to captivate your audience and drive interaction.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='courseName'>Course/Skill name<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='courseName'
                        onChange={handleInputChange}
                        value={formData.courseName}
                        placeholder='Enter the Course/Skill/Class name you want to promote'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='audience'>Audience<span className='asterisk'>*</span></label>
                    <input
                        required
                        type='text'
                        className='form-control'
                        name='audience'
                        onChange={handleInputChange}
                        value={formData.audience}
                        placeholder='Enter the target audience for your ad, such as Parents, Teenagers'
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='cta'>Call to Action</label>
                    <input
                        type='text'
                        className='form-control'
                        name='cta'
                        onChange={handleInputChange}
                        value={formData.cta}
                        placeholder='Enter CTA like Register, Sign up, Join, Apply'
                    />
                </div>

                <Button title='Generate' type="submit" />

                <div className='promptMessage'>Your Prompt Message: <br /><strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default FacebookAdCarousel;
