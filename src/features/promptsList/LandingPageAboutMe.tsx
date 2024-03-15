import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const LandingPageAboutMe = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        trainersName: '',
        problemsNoticed: '',
        challengesInSolving: '',
        result: '',
        mission: '',
        experimentsIDid: ''
    });
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `I want to write an About Me section for a website that audiences relate with and feel inspired by.

    It should start with my name. It should be a story of problems I noticed, challenges in solving them, experiments I ran to find a new way of solving the problem, talk about the outcomes generated thanks to my new way, and finally the impact I want to create.
    
    Talk about my mission of taking what I know to solve the problem once and for all for the people who face this everyday.
    
    Write In about 150 words. Write in first person. Keep sentences short and use multiple short paragraphs with less than 40 words in each paragraph, so it is easy to read.
    
    Problems I noticed: ${formData.problemsNoticed}
    Challenges in solving them: ${formData.challengesInSolving}
    Result: ${formData.result}
    Mission: ${formData.mission}
    Trainer's name and brief introduction: ${formData.trainersName}
    Experiments I did: ${formData.experimentsIDid}`
    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Landing Page: About me</h2>
            <h3>Generate Content for ‘About me’ section on your landing page.</h3>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label htmlFor='trainersName'> Trainer’s Name and Brief Introduction
                        <span className="asterisk">*</span>
                    </label>
                    <textarea
                        required
                        className='form-control'
                        name='trainersName'
                        onChange={handleInputChange}
                        value={formData.trainersName}
                        rows={3}
                        placeholder='Nitin Motiwala, Parenting Coach, 5000+ Parents trained.'>
                    </textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="problemsNoticed"> Problems I Noticed </label>
                    <input
                        className="form-control"
                        name="problemsNoticed"
                        onChange={handleInputChange}
                        value={formData.problemsNoticed}
                        placeholder="Parents struggling to keep up with their digitally immersed kids"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="challengesInSolving"> Challenges in Solving Them </label>
                    <input
                        className="form-control"
                        name="challengesInSolving"
                        onChange={handleInputChange}
                        value={formData.challengesInSolving}
                        placeholder="Conveying the urgency during the COVID era, where online interactions became the norm"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="result"> Result </label>
                    <input
                        className="form-control"
                        name="result"
                        onChange={handleInputChange}
                        value={formData.result}
                        placeholder="A remarkable transformation as parents gradually adapted to the digital landscape. Over the past years, my experiments, akin to a digital parenting boot camp, have empowered countless parents"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mission"> Mission </label>
                    <input
                        className="form-control"
                        name="mission"
                        onChange={handleInputChange}
                        value={formData.mission}
                        placeholder="To equip parents with the skills needed to connect, understand, and guide their children through the complexities of the digital age"
                    />
                </div>


                <div className="form-group">
                    <label htmlFor="experimentsIDid"> Experiments I Did </label>
                    <input
                        className="form-control"
                        name="experimentsIDid"
                        onChange={handleInputChange}
                        value={formData.experimentsIDid}
                        placeholder="Practical exercises, interactive sessions, and tailored tutorials, designed a unique Digital Parenting Toolkit"
                    />
                </div>




                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default LandingPageAboutMe;