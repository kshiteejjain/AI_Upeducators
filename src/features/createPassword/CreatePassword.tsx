// Import necessary libraries and components
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import emailjs from '@emailjs/browser';
import Button from '../../components/buttons/Button';
import Strings from '../../utils/en';
import LoginImages from '../../components/loginImages/loginImages';
import ShowPassword from '../../assets/showPassword.svg';
import HidePassword from '../../assets/hidePassword.svg'

import './CreatePassword.css';

const CreatePassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        password: '',
    });
    const [enteredOTP, setEnteredOTP] = useState('');
    const [isOTPScreen, setIsOTPScreen] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'phone' && isNaN(Number(value))) {
            // If it's not a valid number, don't update the state
            return;
        }
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'phone' ? Number(value) : value,
        }));
    };

    // Example usage
    const generateRandomOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const collectionRef = collection(firestore, 'RegisteredUsers');
            // Check if a document with the given email exists
            const q = query(
                collectionRef,
                where('email', '==', formData.email)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Document with this email exists
                //const docRef = querySnapshot.docs[0].ref;
                // Update the password field in the document
                // await updateDoc(docRef, {
                //     password: randomPassword
                // });
                const otp = generateRandomOTP();
                localStorage.setItem('otp_temp', otp.toString());
                setEnteredEmail(formData.email);
                setIsOTPScreen(true);
                setLoading(false);
                //setFormData(initialFormData);
                emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_SEND_OTP, {
                    message: otp,
                    to_email: formData.email,
                }, import.meta.env.VITE_EMAILJS_API_KEY)
                    .then(response => {
                        console.log('SUCCESS!', response);
                    }, error => {
                        alert(`FAILED...', ${error}`);
                    });
                // Now you can redirect or perform any other actions
            } else {
                // No document with this email found
                alert('Please enter the registered email address.');
            }
        } catch (error) {
            alert('Error updating password in Firestore: ' + error);
        }
    };

    const handleInputChangeOTP = (e: ChangeEvent<HTMLInputElement>) => {
        const enteredValue = e.target.value;
        if (/^\d{0,6}$/.test(enteredValue)) {
            setError('');
        } else {
            setError('OTP must be exactly 6 digits');
        }
        setEnteredOTP(enteredValue);
    };
    
    const logEmailAndOTP = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const usersCollection = collection(firestore, 'RegisteredUsers');
    
        console.log('Form Data:', formData); // Add this line to debug
    
        if (!enteredEmail || !enteredOTP) {
            console.error('Email or OTP is undefined');
            setLoading(false);
            return;
        }
    
        // Validate entered OTP from local storage
        const storedOTP = localStorage.getItem('otp_temp');
        if (storedOTP !== enteredOTP) {
            alert('Entered OTP is incorrect');
            setLoading(false);
            return;
        }
    
        try {
            const userDocRef = doc(usersCollection, enteredEmail);
    
            // Update only the password field
            await updateDoc(userDocRef, { password: formData.password });
    
            localStorage.setItem("isLoggedIn", String(true));
            localStorage.setItem("username", enteredEmail);
            setLoading(false);
            localStorage.removeItem('otp_temp');
    
            // Check if the user exists in OnBoardingQuestions collection
            const onboardingUserSnapshot = await getDocs(
                query(collection(firestore, 'OnboardingQuestions'), where('email', '==', enteredEmail))
            );
    
            if (!onboardingUserSnapshot.empty) {
                // User exists in OnBoardingQuestions collection
                navigate("/Categories");
            } else {
                // User does not exist in OnBoardingQuestions collection
                navigate("/OnBoardingQuestions");
            }
        } catch (error) {
            console.error('Error updating user password: ', error);
            setLoading(false);
        }
    };

    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <h1>{Strings.CreatePassword.title}</h1>
                {isOTPScreen ?
                    <form onSubmit={logEmailAndOTP}>
                        <div className='form-group'>
                            <label htmlFor='name'>OTP <span className='asterisk'>*</span></label>
                            <input
                                type='number'
                                required
                                className='form-control'
                                name='otp'
                                onChange={handleInputChangeOTP}
                                placeholder='Enter OTP'
                            />
                        </div>
                        {error && <div className="errorMessage">{error}</div>}
                        <div className="additional-actions">
                            <Button title={Strings.otp.button} type="submit" />
                        </div>
                    </form> :
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className='form-group'>
                                <label htmlFor='email'>Email <span className='asterisk'>*</span></label>
                                <input type='email' required className='form-control' name='email' onChange={handleInputChange} value={formData.email} placeholder=' Enter Email' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Create Password <span className='asterisk'>*</span></label>
                                <input type={showPassword ? 'text' : 'password'} required className='form-control' name='password' onChange={handleInputChange} value={formData.password} placeholder='Enter Password' />
                                <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                                    {showPassword ? <img src={HidePassword} /> : <img src={ShowPassword} />}
                                </div>
                            </div>
                            <Button title='Submit' type="submit" />
                            {/* <div className="separator"><div className="separator-text">or</div></div> */}
                            {/* <Button title={Strings.register.googleRegister} onClick={logGoogleUser} isSocial isImage imagePath={googleLogo} /> */}
                        </form>

                    </>
                }
            </div>
        </div>
    );
};
export default CreatePassword;