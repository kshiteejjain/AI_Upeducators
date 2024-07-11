import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const HashtagGenerator = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();

    const getInitialFormData = () => ({
        instituteName: '',
        coursesSkillNames: '',
        uspFeatureMilestone: '',
        seoKeyword: ''
    });

    const [formData, setFormData] = useState(getInitialFormData);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Create 1 Google Business page description for ${formData.instituteName}. Include Courses/Skill names, their highlights, features and USP and use proper and simple words. Focus on the primary service/product ${formData.coursesSkillNames}. Highlight the unique selling points and features ${formData.uspFeatureMilestone}. Keep total description in 100 words. Also create short page name for Google business page. Format will be: Primary Course/Skill name and Then Institute name including SEO keyword ${formData.seoKeyword}. In page name take only names of 2 courses. Give Headings for these 2 points as Page name and Description. Create in the format that a Google Business page description should have. Don't include city name in page name.`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });

    };
    return (
        <div className="generator-section">
            <h2>Google Business Page Description</h2>
            <h3> Generate a Description for Google Business Page</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="instituteName"> Institute Name<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="instituteName"
                        onChange={handleInputChange}
                        value={formData.instituteName}
                        placeholder="Eg. Knowledge Academy, Megha classes"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="coursesSkillNames"> Courses/Skill Names<span className="asterisk">*</span></label>
                    <input
                        required
                        className="form-control"
                        name="coursesSkillNames"
                        onChange={handleInputChange}
                        value={formData.coursesSkillNames}
                        placeholder="Eg. maths classes for kids, yoga classes for kids"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="uspFeatureMilestone"> USP/Feature/Milestone </label>
                    <textarea
                        className="form-control"
                        name="uspFeatureMilestone"
                        onChange={handleInputChange}
                        rows={5}
                        value={formData.uspFeatureMilestone}
                        placeholder="Eg. Add Service description, Highlights, USP, Milestone"
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="seoKeyword"> SEO keyword </label>
                    <input
                        className="form-control"
                        name="seoKeyword"
                        onChange={handleInputChange}
                        value={formData.seoKeyword}
                        placeholder="Eg. maths classes in jaipur"
                    />
                </div>
                
                <Button title='Generate' type="submit" />

            </form>
        </div>
    )
};
export default HashtagGenerator;
