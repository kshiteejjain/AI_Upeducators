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


const StoryCreationGenerator = () => {
    const loadingStatus = useSelector((state: RootState) => state.generatorData?.status);
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptMsg, setShowPromptMsg] = useState('');

    useEffect(() => {
        setIsLoading(loadingStatus === 'loading');
    }, [loadingStatus]);

    const [formData, setFormData] = useState({
        storyTitle: '',
        setting: 'Modern City',
        plotOutline: '',
        mainCharacter: '',
        conflict: 'Character vs. Character',
        theme: 'Fiction',
        additionalCharacters: '',
        additionalNotes: '',
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
            const promptMessage = `Generate a story titled "${formData.storyTitle}". Setting: ${formData.setting}. The plot involves ${formData.plotOutline}. The main character is ${formData.mainCharacter}, facing a conflict of ${formData.conflict}. The central theme of the story is ${formData.theme}. Additional characters include ${formData.additionalCharacters}. ${formData.additionalNotes}.`;

            setShowPromptMsg(promptMessage);
            dispatchThunk(generatorPrompt(promptMessage));
        } catch (error) {
            alert('Error fetching data:', error);
        }
    };

    return (
        <div className="generator-section">
            {isLoading ? <Loader /> : null}
            <h2>Story Creation Generator</h2>
            <h3>This form is structured to assist in crafting a story by outlining key narrative elements such as setting, plot, conflict, character, and theme.</h3>
            <form onSubmit={sendPrompt}>
                <div className='form-group'>
                    <label htmlFor='storyTitle'>Story Title <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='storyTitle' onChange={handleInputChange} value={formData.storyTitle} placeholder='Enter a title or a central idea for your story.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='setting'>Setting <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="setting" onChange={handleInputChange} value={formData.setting}>
                        <option value="Modern City">Modern City</option>
                        <option value="Historical Setting">Historical Setting</option>
                        <option value="Fantasy World">Fantasy World</option>
                        <option value="Outer Space">Outer Space</option>
                        <option value="Underwater">Underwater</option>
                        <option value="Futuristic Society">Futuristic Society</option>
                        <option value="Natural Wilderness">Natural Wilderness</option>
                        <option value="Other">Other (Specify)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='plotOutline'>Plot Outline <span className='asterisk'>*</span></label>
                    <textarea required className='form-control' name='plotOutline' onChange={handleInputChange} rows={5} value={formData.plotOutline} placeholder='Provide a brief outline of the story"s main events and progression.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='mainCharacter'>Main Character <span className='asterisk'>*</span></label>
                    <input required className='form-control' name='mainCharacter' onChange={handleInputChange} value={formData.mainCharacter} placeholder='Name and briefly describe the main character of your story.' />
                </div>
                <div className='form-group'>
                    <label htmlFor='conflict'>Conflict <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="conflict" onChange={handleInputChange} value={formData.conflict}>
                        <option value="Character vs. Character">Character vs. Character</option>
                        <option value="Character vs. Self">Character vs. Self</option>
                        <option value="Character vs. Society">Character vs. Society</option>
                        <option value="Character vs. Nature">Character vs. Nature</option>
                        <option value="Character vs. Supernatural">Character vs. Supernatural</option>
                        <option value="Character vs. Technology">Character vs. Technology</option>
                        <option value="Other">Other (Specify)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='theme'>Theme <span className='asterisk'>*</span></label>
                    <select required className='form-control' name="theme" onChange={handleInputChange} value={formData.theme}>
                        <option value="Fiction">Fiction</option>
                        <option value="Moral Value">Moral Value</option>
                        <option value="Love">Love</option>
                        <option value="Friendship">Friendship</option>
                        <option value="Betrayal">Betrayal</option>
                        <option value="Courage">Courage</option>
                        <option value="Coming of Age">Coming of Age</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Mystery">Mystery</option>
                        <option value="Other">Other (Specify)</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalCharacters'>Additional Characters</label>
                    <textarea className='form-control' name='additionalCharacters' onChange={handleInputChange} rows={5} value={formData.additionalCharacters} placeholder='List and describe any additional significant characters.'> </textarea>
                </div>
                <div className='form-group'>
                    <label htmlFor='additionalNotes'>Additional Notes</label>
                    <textarea className='form-control' name='additionalNotes' onChange={handleInputChange} rows={5} value={formData.additionalNotes} placeholder='Include any other relevant details or elements you wish to add to your story.'> </textarea>
                </div>
                <Button title='Generate' type="submit" />
                <div className='promptMessage'> Your Prompt Message: <br /> <strong>{showPromptMsg}</strong></div>
            </form>
        </div>
    )
};

export default StoryCreationGenerator;