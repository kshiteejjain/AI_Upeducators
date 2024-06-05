import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const HashtagGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        ratingGiven: '',
        reviewGiven: '',
        reviewersDetails: '',
        courseSkillName: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `What should be ideal reply to google business ${formData.ratingGiven} rating and review as an educational institute? Review was given by ${formData.reviewersDetails}. Course name is ${formData.courseSkillName}. Review was ${formData.reviewGiven}. Keep ideal character count. Reviewer’s name and designation (if provided) should come alongside.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });

    };
    return (
        <div className="generator-section">
            <h2>Google Business Page Review Reply</h2>
            <h3>Generate replies for customers’ reviews</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="ratingGiven"> Rating given (out of 5) <span className="asterisk">*</span></label>
                    <select
                        required
                        className="form-control"
                        name="ratingGiven"
                        onChange={handleInputChange}
                        value={formData.ratingGiven}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="reviewGiven"> Review given </label>
                    <input
                        className="form-control"
                        name="reviewGiven"
                        onChange={handleInputChange}
                        value={formData.reviewGiven}
                        placeholder="Eg. Paste the review given by customer"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="reviewersDetails"> Reviewer’s details </label>
                    <input
                        className="form-control"
                        name="reviewersDetails"
                        onChange={handleInputChange}
                        value={formData.reviewersDetails}
                        placeholder="Eg. Teena Desai, 8th class student, APS, Delhi"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="courseSkillName"> Course/Skill name for which review was given </label>
                    <input
                        className="form-control"
                        name="courseSkillName"
                        onChange={handleInputChange}
                        value={formData.courseSkillName}
                        placeholder="Dance classes"
                    />
                </div>

                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default HashtagGenerator;
