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
import googleLogo from '../../assets/google.svg';

import './FreeTrial.css';

const FreeTrial = () => {
    const currentDateTime = new Date();
    const formattedDateTime = currentDateTime.toLocaleString();
    const initialFormData = {
        name: '',
        email: '',
        phone: '',
        password: '',
        total_credits: 100,
        remain_credits: 100,
        access_duration_days: 30,
        expire_date: 0,
        credits_limit_perday: 20,
        isActiveUser: true,
        isAdmin: false,
        register_timestamp: formattedDateTime,
        otp: '',
        isFreeUser: true,
        isPrePaidUser: false,
        campaignName: '',
        campaignSource: '',
        campaignMedium: ''
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
            [name]: value,
            [name]: name === 'phone' ? Number(value) : value,
        }));
    };
    const handleForgotPassword = () => {
        navigate('/ForgotPassword')
    }
    const generateRandomOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000);
        setFormData((prevData) => ({
            ...prevData,
            otp: otp.toString(),
        }));
        return otp.toString();
    };

    const formSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const querySnapshot = await getDocs(
                query(collection(firestore, 'RegisteredUsers'), where('email', '==', formData.email))
            );
            if (!querySnapshot.empty) {
                // Email already exists, show alert or handle accordingly
                alert('Email is already registered!');
                return;
            }
            const otp = generateRandomOTP();
            const selfRegisteredUsersCollection = collection(firestore, 'RegisteredUsers');
            const userDocRef = doc(selfRegisteredUsersCollection, formData?.email); 
            await setDoc(userDocRef, {
                ...formData,
                otp: Number(otp),
            });
            setEnteredEmail(formData.email);
            setIsOTPScreen(true);
            setLoading(false)
            // Optional: Clear the form after submission
            setFormData(initialFormData);
            emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTER, {
                ...formData,
                message: otp,
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
            return;
        }
        const q = query(usersCollection, where('email', '==', enteredEmail), where('otp', '==', Number(enteredOTP)));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                alert('Registration Successful, Redirecting to login.');
                setLoading(false)
                navigate('/')
            } else {
                alert('Email and OTP do not match');
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching documents: ', error);
            setLoading(false)
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
                total_credits: 100,
                remain_credits: 100,
                access_duration_days: 30,
                expire_date: 0,
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
                            <Button isSecondary title={Strings.login.register} type="button" onClick={() => setIsOTPScreen(false)} />
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
                                <input type='tel' required className='form-control' name='phone' onChange={handleInputChange} value={formData.phone} placeholder='Enter Phone' />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password'>Password <span className='asterisk'>*</span></label>
                                <input type={showPassword ? 'text' : 'password'} required className='form-control' name='password' onChange={handleInputChange} value={formData.password} placeholder='Enter Password' />
                                <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                                    {showPassword ? <img src={HidePassword} /> : <img src={ShowPassword} />}
                                </div>
                            </div>
                            <Button title='Register' type="submit" />
                            <div className="separator"><div className="separator-text">or</div></div>
                            <Button title={Strings.register.googleRegister} onClick={logGoogleUser} isSocial isImage imagePath={googleLogo} />
                        </form>
                        <div className="additional-actions">
                            <Button title={Strings.ForgotPassword.title} isSecondary type="button" onClick={handleForgotPassword} />
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
