import React, { useState, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatorPrompt } from '../promptListGeneratorSlice/QuestionGeneratorSlice';
import Button from '../../components/buttons/Button';
import { sendPrompt } from '../../utils/sendPrompt';

const EventReport = () => {
    const { generatorData: { messages, input } } = useSelector((state) => state);
    const dispatch = useDispatch();
    const getInitialFormData = () => ({
        eventType: '',
        keyHighlights: '',
        attendeeFeedback: '',
        additionalDetails: '',
    });
    const [formData, setFormData] = useState(getInitialFormData);
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const promptMessage = `Generate a report for the ${formData.eventType} event. The report should include these key highlights: ${formData.keyHighlights}. 
    The introduction and conclusion should be in paragraphs and the main report should be point-wise.
    Also include these attendee feedbacks if provided: ${formData.attendeeFeedback}.
    The report should be point-wise.
    Consider these additional details: ${formData.additionalDetails}`;

    const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendPrompt(dispatch, { input, messages, generatorPrompt, promptMessage });
    };
    return (
        <div className="generator-section">
            <h2>Event Report</h2>
            <h3>Create detailed and structured reports for any event.</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="eventType">Event Type<span className="asterisk">*</span></label>
                    <input required className="form-control" name="eventType" onChange={handleInputChange} value={formData.eventType} placeholder="e.g., Conference, Academic Ceremony, Sports Day, Workshop, Seminar, Annual Science Fair" />
                </div>

                <div className="form-group">
                    <label htmlFor="keyHighlights">Key Highlights<span className="asterisk">*</span></label>
                    <textarea required className="form-control" name="keyHighlights" onChange={handleInputChange} value={formData.keyHighlights} rows={5} placeholder="Describe the main highlights and significant moments of the event (e.g., Cultural Performances, Names of the Guests of Honor, Scholarship Awards, Keynote Address)"></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="attendeeFeedback">Attendee Feedback</label>
                    <textarea className="form-control" name="attendeeFeedback" onChange={handleInputChange} value={formData.attendeeFeedback} rows={5} placeholder="Provide a summary of the feedback received from attendees."></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="additionalDetails">Additional Details</label>
                    <textarea className="form-control" name="additionalDetails" onChange={handleInputChange} value={formData.additionalDetails} rows={5} placeholder="e.g., Text Length, Language Preference, Number of Attendees, Any other additional information"></textarea>
                </div>

                <Button title='Generate' type="submit" />
            </form>
        </div>
    )
};
export default EventReport;
