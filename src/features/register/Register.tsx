import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { firestore, signInWithGooglePopup, } from '../../utils/firebase';
import { collection, getDocs, where, query, doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import Loader from '../../components/loader/Loader';
import Button from '../../components/buttons/Button';
import LoginImages from '../../components/loginImages/loginImages';
import Strings from '../../utils/en';
import ShowPassword from '../../assets/showPassword.svg';
import HidePassword from '../../assets/hidePassword.svg'

import './Register.css';

const Register = () => {
    const currentDateTime = new Date();
    currentDateTime.setDate(currentDateTime.getDate() + 365)
    const formattedDateTime = currentDateTime.toISOString().split('T')[0];
    const registerDate = new Date().toISOString().split('T')[0];
    const initialFormData = {
        name: '',
        email: '',
        password: '',
        total_credits: 0,
        remain_credits: 0,
        access_duration_days: 365,
        credits_limit_perday: 50,
        isActiveUser: true,
        isAdmin: false,
        expiry: formattedDateTime,
        register_timestamp: registerDate,
        isFreeUser: false,
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


    // const fetchPaidUserData = async () => {
    //     setLoading(true);
    //     try {
    //         const q = query(
    //             collection(firestore, "AIUpEducatorsPaidUsers"),
    //             where("payload.payment.entity.notes.email", "!=", null) // Adjust this condition as necessary
    //         );
    //         const querySnapshot = await getDocs(q);
    //         if (!querySnapshot.empty) {
    //             const userData = querySnapshot.docs.map(doc => {
    //                 const data = doc.data();
    //                 return {
    //                     name: data.payload.payment.entity.notes.name,
    //                     email: data.payload.payment.entity.notes.email,
    //                     phone: data.payload.payment.entity.notes.phone,
    //                 };
    //             })[0]; // Assuming you need the first result
    //             setFormData(prev => ({
    //                 ...prev,
    //                 ...userData,
    //                 name: userData.name,
    //                 email: userData.email,
    //                 phone: userData.phone
    //             }));
    //         }
    //     } catch (error) {
    //         console.error("Failed to fetch user data:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // useEffect(() => {
    //     fetchPaidUserData();
    // }, []); 

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
    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const isEmailInPaidUsers = async (email: string, plan?: string) => {
        const paidUsersSnapshot = await getDocs(
            query(
                collection(firestore, 'AIUpEducatorsPaidUsers'),
                where('payload.payment.entity.notes.email', '==', email),
                where('payload.payment.entity.notes.plan', '==', plan)
            )
        );
        return !paidUsersSnapshot.empty;
    };


    const isEmailRegistered = async (email: string) => {
        const querySnapshot = await getDocs(
            query(collection(firestore, 'RegisteredUsers'), where('email', '==', email))
        );
        return !querySnapshot.empty;
    };

    const sendEmail = async (email: string, otp: number) => {
        try {
            await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTER, {
                ...formData,
                message: otp,
                to_email: email,
            }, import.meta.env.VITE_EMAILJS_API_KEY);
            console.log('Email sent successfully!');
        } catch (error) {
            console.error('Failed to send email:', error);
            throw new Error('Failed to send email');
        }
    };


    useEffect(() => {
        const url = window.location.href;
        const queryStringIndex = url.indexOf('?');
        if (queryStringIndex !== -1) {
            const queryString = url.substring(queryStringIndex + 1);
            const params = new URLSearchParams(queryString);
            const paramFound = params.has('frmrzp_prm');
            if (paramFound) {
                return;
            } else {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    }, []);



    const formSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!formData.email) {
                throw new Error('Email is required.');
            }

            let plan = '';
            // Determine plan based on email
            if (await isEmailInPaidUsers(formData.email, 'Silver')) {
                plan = 'Silver';
                formData.total_credits += 1500;
                formData.remain_credits += 1500;
            } else if (await isEmailInPaidUsers(formData.email, 'Platinum')) {
                plan = 'Platinum';
                formData.total_credits = 2500;
                formData.remain_credits = 2500;
            }
            if (!plan) {
                alert("You are not a subscriber. Please choose a plan. Redirecting to our plans.");
                window.location.href = 'https://upeducators.ai/pricing';
                return;
            }
            // Check if the email is in the paid users collection
            const isPaidUser = await isEmailInPaidUsers(formData.email, plan);
            if (!isPaidUser) {
                alert("You are not a subscriber. Please choose a plan. Redirecting to our plans.");
                window.location.href = 'https://upeducators.ai/pricing';
                return;
            }
            // Check if the email is already registered
            // const isRegistered = await isEmailRegistered(formData.email);
            // if (isRegistered) {
            //     alert('Email is already registered!');
            //     navigate('/');
            //     return;
            // }
            // Generate OTP and store it temporarily
            const otp = generateOTP();
            localStorage.setItem('otp_temp', otp);
            await emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_ID, import.meta.env.VITE_EMAILJS_TEMPLATE_REGISTER, {
                message: `OTP: ${otp}`,
                to_email: formData.email,
            }, import.meta.env.VITE_EMAILJS_API_KEY);
            console.log('Email sent successfully!');

            const updatedFormData = {
                ...formData,
                plan: plan,
            };
            // Update formData with plan and other details

            // Fetch current expiry date from Firebase RegisteredUsers collection
            // const userDocRef = doc(collection(firestore, 'RegisteredUsers'), formData.email);
            // const userDocSnapshot = await getDoc(userDocRef);
            // if (userDocSnapshot.exists()) {
            //     const userData = userDocSnapshot.data();
            //     if (userData && userData.expiry) {
            //         const currentExpiry = new Date(userData.expiry);
            //         currentExpiry.setDate(currentExpiry.getDate() + 365);
            //         const extendedExpiry = currentExpiry.toISOString().split('T')[0];
            //         formData.expiry = extendedExpiry;
            //     }
            // }
            // Set entered email, switch to OTP screen, and update formData
            setEnteredEmail(formData.email);
            setIsOTPScreen(true);
            setLoading(false);
            setFormData(updatedFormData)
            //localStorage.setItem("isLoggedIn", String(true));
            //localStorage.setItem("username", formData?.email);
            // Instead of setDoc, use updateDoc to update existing document
            // const userDocReference = doc(collection(firestore, 'RegisteredUsers'), formData.email);
            // await updateDoc(userDocReference, updatedFormData);

            // const onboardingUserSnapshot = await getDocs(
            //     query(collection(firestore, 'OnboardingQuestions'), where('email', '==', formData.email))
            // );
            // if (!onboardingUserSnapshot.empty) {
            //     // User exists in OnBoardingQuestions collection
            //     navigate("/Categories");
            // } else {
            //     // User does not exist in OnBoardingQuestions collection
            //     navigate("/OnBoardingQuestions");
            // }
        } catch (error) {
            alert(`An error occurred: ${error}`);
            console.error('Error submitting form:', error);
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
        try {
            if (!enteredEmail) {
                throw new Error('Email is empty or undefined');
            }

            if (enteredOTP === localStorage.getItem('otp_temp')) {
                localStorage.removeItem('otp_temp');
                setEnteredEmail(enteredEmail);

                let plan = '';
                if (await isEmailInPaidUsers(enteredEmail, 'Silver')) {
                    plan = 'Silver';
                } else if (await isEmailInPaidUsers(enteredEmail, 'Platinum')) {
                    plan = 'Platinum';
                }

                const updatedFormData = {
                    ...formData,
                    plan: plan,
                };

                const usersCollection = collection(firestore, 'RegisteredUsers');
                const userDocRef = doc(usersCollection, enteredEmail);
                await setDoc(userDocRef, updatedFormData);

                const onboardingUserSnapshot = await getDocs(
                    query(collection(firestore, 'OnboardingQuestions'), where('email', '==', enteredEmail))
                );
                if (!onboardingUserSnapshot.empty) {
                    navigate("/Categories");
                } else {
                    navigate("/OnBoardingQuestions");
                }
                localStorage.setItem("isLoggedIn", String(true));
                localStorage.setItem("username", formData?.email);
                setLoading(false);
            } else {
                alert('You have entered wrong OTP');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error submitting form:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await signInWithGooglePopup();
            const user = response?.user;
            const email = user?.email;
            if (!email) {
                throw new Error('User email not found');
            }
            let plan = '';
            let totalCredits = 0;
            let remainCredits = 0;
            // Determine plan based on email
            if (await isEmailInPaidUsers(email, 'Silver')) {
                plan = 'Silver';
                totalCredits = 1500;
                remainCredits = 1500;
            } else if (await isEmailInPaidUsers(email, 'Platinum')) {
                plan = 'Platinum';
                totalCredits = 2500;
                remainCredits = 2500;
            }
            let updatedFormData = {
                ...initialFormData,
                email: user.email,
                plan: plan,
                total_credits: totalCredits,
                remain_credits: remainCredits
            };
            // Check if the email is in the paid users collection
            const isPaidUser = await isEmailInPaidUsers(email, plan);
            if (!isPaidUser) {
                alert("You are not a subscriber. Please choose a plan. Redirecting to our plans.");
                window.location.href = 'https://upeducators.ai/pricing';
                return;
            }
            // Check if the email is already registered
            const isRegistered = await isEmailRegistered(formData.email);
            if (isRegistered) {
                alert('Email is already registered!');
                navigate('/');
                return;
            }
            updatedFormData.plan = plan;
            // Generate OTP and store it temporarily
            const otp = generateOTP();
            localStorage.setItem('otp_temp', otp);

            setEnteredEmail(email);
            setIsOTPScreen(true);
            setLoading(false);
            setFormData(updatedFormData);
            await setDoc(doc(collection(firestore, 'RegisteredUsers'), email), { ...updatedFormData });
            await sendEmail(email, otp);
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Error logging in with Google:', error);
        }
    };



    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <h1>
                    {!isOTPScreen ? Strings.register.title : <> {Strings.otp.title} <span className='otpSent'>{Strings.otp.emailSent}</span> </>}
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
                            <Button title='Register' type="submit" />
                            {/* <div className="separator"><div className="separator-text">or</div></div>
                            <Button title={Strings.register.googleRegister} onClick={handleGoogleLogin} isSocial isImage imagePath={googleLogo} /> */}
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
export default Register;
