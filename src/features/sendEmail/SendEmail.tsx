import { useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';

interface SendEmailProps {
  toEmail: string;
  templateId: string;
  message: string;
  apiKey: string;
}

const SendEmail: React.FC<SendEmailProps> = ({ toEmail, templateId, message, apiKey }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const sendEmail = async () => {
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          templateId,
          {
            to_email: toEmail,
            message: message,
          },
          apiKey
        );
        console.log('Email sent successfully');
        alert('We have sent the password to your registered email.');
        navigate('/');
      } catch (error) {
        console.error('Failed to send email:', error);
        alert('Failed to send email. Please try again later.');
      }
    };

    sendEmail();
  }, [toEmail, templateId, message, apiKey, navigate]);

  return null; // Since this is a utility component, it doesn't render anything
};

export default SendEmail;
