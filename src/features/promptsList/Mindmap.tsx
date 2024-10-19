import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EmailTitleGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        topic: ''
    });
    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create a mind map of ${formData.topic}. List topics as central ideas, main branches, and sub-branches." give output in markmap format strictly. no extra content, title, caption  or content required. add # before all titles based on h1 to h6 heading and add - before child content so that it will align as per markmap format. use sample format like this: # Mind Map
    ## heading 1
    ## heading  2
    ### heading 3
    #### heading 4
    - child item 1
    - child item 2
    - child item 3
    add break line \n before every # and -.
    `

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
        
        // Update localStorage with isMindmap set to true
        localStorage.setItem('upEdu_prefix', JSON.stringify({
            ...JSON.parse(localStorage.getItem('upEdu_prefix') || '{}'),
            isMindmap: true
        }));
    };
    return (
        <div className="generator-section">
            <h2>Mindmap</h2>
            <h3>Create descriptive mindmap</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="topic">Topic<span className="asterisk">*</span></label>
                    <textarea
                        rows={5}
                        required
                        className="form-control"
                        name="topic"
                        onChange={handleInputChange}
                        value={formData.topic}
                        placeholder="Roadmap, Mindmap, subject, topic"
                    />
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EmailTitleGenerator;