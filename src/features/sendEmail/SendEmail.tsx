import { useState } from 'react';
import { SendMailClient } from "zeptomail";

const EmailSender = ({ userEmails, templateId }) => {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const url = import.meta.env.VITE_ZEPTO_URL;
    const token = import.meta.env.VITE_ZEPTO_TOKEN;
    const client = new SendMailClient({ url, token });

    const sendEmail = async () => {
        setSending(true);
        try {
            const response = await client.sendMail({
                "from": {
                    "address": "noreply@upeducators.ai",
                    "name": "noreply"
                },
                "to": userEmails.map(email => ({
                    "email_address": {
                        "address": email,
                        "name": "" // you can customize the name if needed
                    }
                })),
                "template_id": templateId, // Assuming the templateId is passed as a prop
            });
            console.log("Emails sent successfully:", response);
        } catch (error) {
            setError(error.message);
            console.error("Error sending emails:", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <button onClick={sendEmail} disabled={sending}>
                {sending ? 'Sending...' : 'Send Emails'}
            </button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default EmailSender;
