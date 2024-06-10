import { useState, ChangeEvent, FormEvent } from 'react';
import { firestore, signInWithGooglePopup } from '../../utils/firebase';
import { collection, getDocs, where, query, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Loader from '../../components/loader/Loader';
import Button from '../../components/buttons/Button';
import LoginImages from '../../components/loginImages/loginImages';
import Strings from '../../utils/en';
import ShowPassword from '../../assets/showPassword.svg';
import HidePassword from '../../assets/hidePassword.svg'

import './FreeTrial.css';

const FreeTrial = () => {
    const currentDateTime = new Date();
    currentDateTime.setDate(currentDateTime.getDate() + 30);
    const formattedDateTime = currentDateTime.toISOString().split('T')[0];
    const registerDate = new Date().toISOString().split('T')[0];
    const id = (Math.random()  + 2).toString(36).substring(2);

    const initialFormData = {
        id: id,
        name: '',
        email: '',
        phone: '',
        password: '',
        total_credits: 50,
        remain_credits: 50,
        access_duration_days: 30,
        credits_limit_perday: 20,
        isActiveUser: true,
        isAdmin: false,
        expiry: formattedDateTime,
        register_timestamp: registerDate,
        isFreeUser: true,
        isPrePaidUser: false,
        campaignName: '',
        campaignSource: '',
        campaignMedium: '',
        batch: ''
    };
    const [showPassword, setShowPassword] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState('');
    const [enteredOTP, setEnteredOTP] = useState('');
    const [isOTPScreen, setIsOTPScreen] = useState(false)
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData)
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

    const handleForgotPassword = () => {
        navigate('/CreatePassword')
    }
    const generateRandomOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    };

    const formSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const querySnapshot = await getDocs(
                query(collection(firestore, 'RegisteredUsers'), where('email', '==', formData.email))
            );
            if (!querySnapshot.empty) {
                // Email already exists, show alert or handle accordingly
                alert('Email is already registered!');
                setLoading(false);
                return;
            }
            const otp = generateRandomOTP();
            localStorage.setItem('otp_temp', otp.toString());
            setEnteredEmail(formData.email);
            setIsOTPScreen(true);
            setLoading(false);
            //setFormData(initialFormData);
            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_SEND_OTP, {
                message: otp,
                registeredUsername: formData.name,
                to_email: formData.email,
            }, import.meta.env.VITE_EMAILJS_API_KEY)
                .then(response => {
                    console.log('SUCCESS!', response);
                }, error => {
                    alert(`FAILED...', ${error}`);
                });
        } catch (error) {
            alert(`An error occurred:', ${error}`);
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
            // Update formData with entered email and OTP
            const updatedFormData = {
                ...formData,
            };
            const userDocRef = doc(usersCollection, enteredEmail);
            await setDoc(userDocRef, updatedFormData);
            await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME_FREE_TRIAL, {
                registeredEmail: formData.email,
                registeredUsername: formData.name,
                registeredPlan: 'Free',
                credits: 50,
                registeredDate: new Date().toISOString().split('T')[0].split('-').reverse().join('-'),
                expiryDate: formData.expiry.split('-').reverse().join('-'),
                to_email: formData.email,
            }, import.meta.env.VITE_EMAILJS_API_KEY);
            console.log('Email sent successfully!');
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
            console.error('Error storing user data: ', error);
            setLoading(false);
        }
    };




    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            const user = response?.user;
            const querySnapshot = await getDocs(
                query(collection(firestore, 'RegisteredUsers'), where('email', '==', user?.email))
            );
            if (!querySnapshot.empty) {
                // Email already exists, show alert or handle accordingly
                alert('Email is already registered!');
                return;
            }
            const otp = generateRandomOTP();
            setEnteredEmail(user?.email); // Use extracted email
            setIsOTPScreen(true);
            setLoading(false);
            // Optional: Clear the form after submission
            const updatedFormData = {
                name: user?.displayName,
                email: user?.email, // Use user's email here instead of enteredEmail
                phone: '',
                password: '',
                total_credits: 50,
                remain_credits: 50,
                access_duration_days: 30,
                credits_limit_perday: 20,
                isActiveUser: true,
                isAdmin: false,
                register_timestamp: formattedDateTime,
                otp: otp,
                isFreeUser: true,
                isPrePaidUser: false,
                campaignName: '',
                campaignSource: '',
                campaignMedium: ''
            };
            setFormData(updatedFormData);
            const selfRegisteredUsersCollection = collection(firestore, 'RegisteredUsers');
            const userDocRef = doc(selfRegisteredUsersCollection, user?.email); // Use user's email as document ID
            await setDoc(userDocRef, {
                ...updatedFormData,
                otp: Number(otp),
            });
            // Adding the form data to the Firestore collection

            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTER, {
                ...formData,
                message: otp,
                to_email: user?.email,
            }, import.meta.env.VITE_EMAILJS_API_KEY)
                .then(response => {
                    console.log('SUCCESS!', response);
                }, error => {
                    alert(`FAILED...', ${error}`);
                });
        } catch (error) {
            alert(`Error: ${error}`);
        }
    };



    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <h1>
                    {!isOTPScreen ? Strings.FreeTrial.title : <> {Strings.otp.title} <span className='otpSent'>{Strings.otp.emailSent}</span> </>}
                </h1>
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
                        <form onSubmit={formSubmit}>
                            <div className='form-group'>
                                <label htmlFor='name'>Name <span className='asterisk'>*</span></label>
                                <input type='text' required className='form-control' name='name' onChange={handleInputChange} value={formData.name} placeholder='Enter Name' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='email'>Email <span className='asterisk'>*</span></label>
                                <input type='email' required className='form-control' name='email' onChange={handleInputChange} value={formData.email} placeholder=' Enter Email' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='phone'>Phone <span className='asterisk'>*</span></label>
                                <input type='tel' required className='form-control' name='phone' onChange={handleInputChange} value={formData.phone} placeholder='Enter Phone' pattern='[0-9]{10,}' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Create Password <span className='asterisk'>*</span></label>
                                <input type={showPassword ? 'text' : 'password'} required className='form-control' name='password' onChange={handleInputChange} value={formData.password} placeholder='Enter Password' />
                                <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                                    {showPassword ? <img src={HidePassword} /> : <img src={ShowPassword} />}
                                </div>
                            </div>
                            <Button title='Register' type="submit" />
                            {/* <div className="separator"><div className="separator-text">or</div></div> */}
                            {/* <Button title={Strings.register.googleRegister} onClick={logGoogleUser} isSocial isImage imagePath={googleLogo} /> */}
                        </form>
                        <div className="additional-actions">
                            <Button title={Strings.CreatePassword.title} isSecondary type="button" onClick={handleForgotPassword} />
                            <Button isSecondary title={Strings.login.buttonLogin} type="button" onClick={() => navigate('/')} />
                        </div>

                    </>
                }
            </div>
            {loading && <Loader />}
        </div>
    )
};
export default FreeTrial;
