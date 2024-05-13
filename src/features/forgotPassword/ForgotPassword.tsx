// Import necessary libraries and components
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import emailjs from '@emailjs/browser';
import Button from '../../components/buttons/Button';
import Strings from '../../utils/en';
import LoginImages from '../../components/loginImages/loginImages';
import './ForgotPassword.css';
const ForgotPassword = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
    });
    const navigate = useNavigate();
    const generateRandomPassword = () => {
        const length = 8;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        return password;
    };
    
    // Example usage
    const randomPassword = generateRandomPassword();
    const handleResetPassword = async (e: any) => {
        e.preventDefault();
        try {
            const collectionRef = collection(firestore, 'RegisteredUsers');
            // Check if a document with the given email exists
            const q = query(
                collectionRef,
                where('email', '==', userDetails.email)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Document with this email exists
                const docRef = querySnapshot.docs[0].ref;
                // Update the password field in the document
                await updateDoc(docRef, {
                    password: randomPassword
                });
                emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_FORGOT_PASSWORD, {
                    to_email: userDetails.email,
                    message: randomPassword,
                }, import.meta.env.VITE_EMAILJS_API_KEY)
                    .then(response => {
                        console.log('SUCCESS!', response);
                        alert('We have sent password on your registered email.');
                        navigate('/')
                    }, error => {
                        console.log(`FAILED...', ${error}`);
                    });
                // Now you can redirect or perform any other actions
            } else {
                // No document with this email found
                alert('Email Id not found, Kindly contact to admin.');
            }
        } catch (error) {
            alert('Error updating password in Firestore: ' + error);
        }
    };
    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <h1>{Strings.ForgotPassword.title}</h1>
                <form onSubmit={handleResetPassword}>
                    <div className='form-group'>
                        <label htmlFor='email'>Email <span className='asterisk'>*</span></label>
                        <input
                            type='email'
                            required
                            className='form-control'
                            name='email'
                            value={userDetails.email}
                            placeholder='Enter Email'
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        />
                    </div>
                    <Button title='Reset Password' type='submit' />
                </form>
            </div>
        </div>
    );
};
export default ForgotPassword;