import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from '../../components/buttons/Button';
import Strings from '../../utils/en';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore, signInWithGooglePopup } from '../../utils/firebase';
import LoginImages from "../../components/loginImages/loginImages";
import Loader from "../../components/loader/Loader";
import ShowPassword from '../../assets/showPassword.svg';
import HidePassword from '../../assets/hidePassword.svg'
import googleLogo from '../../assets/google.svg';

import './Login.css';

const Login = () => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });
    const [loader, setLoader] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const handleForgotPassword = () => {
        navigate('/CreatePassword')
    }
    const handleSignUp = () => {
        navigate('/FreeTrial')
    }
    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const uploadDataToFirestore = async (e: any) => {
        e.preventDefault();
        setLoader(true);
        try {
            const collectionRef = collection(firestore, 'RegisteredUsers');
            // Check if a document with the given email and password exists
            const q = query(
                collectionRef,
                where('email', '==', userDetails?.email),
                where('password', '==', userDetails?.password)
            );
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Document with this email and password exists
                querySnapshot.forEach(async (doc) => {
                    const data = doc.data();
                    const remainCredits = data?.remain_credits;
                    const isActiveUser = data?.isActiveUser;
                    localStorage.setItem("isLoggedIn", String(true));
                    localStorage.setItem("username", data?.email);
                    setLoader(false);
                    if (remainCredits <= 0 || isActiveUser === false) {
                        navigate("/ContactUs");
                    } else {
                        const onboardingUserSnapshot = await getDocs(
                            query(collection(firestore, 'OnboardingQuestions'), where('email', '==', userDetails?.email))
                        );
                        if (!onboardingUserSnapshot.empty) {
                            // User exists in OnBoardingQuestions collection
                            navigate("/Categories");
                        } else {
                            // User does not exist in OnBoardingQuestions collection
                            navigate("/OnBoardingQuestions");
                        }
                    }
                });
            } else {
                // No document with this email and password found
                alert('You have entered wrong username and password');
                setLoader(false);
            }
        } catch (error) {
            alert('Error querying data from Firestore: ' + error);
            setLoader(false);
        }
    };

    useEffect(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            navigate('/Categories');
        }
    }, [navigate]);

    const logGoogleUser = async () => {
        try {
            const response = await signInWithGooglePopup();
            const user = response.user;

            // Extract user data
            const email = user?.email;

            // Check if the user exists in RegisteredUsers collection
            const registeredUserSnapshot = await getDocs(
                query(collection(firestore, 'RegisteredUsers'), where('email', '==', email))
            );

            if (!registeredUserSnapshot.empty) {
                // User exists in RegisteredUsers collection
                localStorage.setItem("isLoggedIn", String(true));
                localStorage.setItem("username", email);

                // Check if the user exists in OnBoardingQuestions collection
                const onboardingUserSnapshot = await getDocs(
                    query(collection(firestore, 'OnboardingQuestions'), where('email', '==', email))
                );
                if (!onboardingUserSnapshot.empty) {
                    // User exists in OnBoardingQuestions collection
                    navigate("/Categories");
                } else {
                    // User does not exist in OnBoardingQuestions collection
                    navigate("/OnBoardingQuestions");
                }
            } else {
                // Email doesn't exist in RegisteredUsers, handle accordingly
                alert('Email is not registered, Redirecting to Register');
                window.location.href = 'https://upeducators.ai/pricing';
            }

        }
        catch (error) {
            alert(`Error: ${error}`);
        }
    };



    return (
        <div className='login-wrapper'>
            <LoginImages />
            <div className='login-form'>
                <h1>{Strings.login.title}</h1>
                <form onSubmit={uploadDataToFirestore}>
                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>{Strings.login.email}</label>
                        <input
                            type='email'
                            autoComplete="off"
                            className='form-control'
                            required
                            name="email"
                            autoFocus
                            value={userDetails.email}
                            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='gradeLevel'>{Strings.login.password}</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className='form-control'
                            required
                            name="password"
                            value={userDetails.password}
                            onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                        />
                        <div className="togglePassword" onClick={handleTogglePasswordVisibility}>
                            {showPassword ? <img src={HidePassword} /> : <img src={ShowPassword} />}
                        </div>
                    </div>
                    <Button title={Strings.login.buttonLogin} type="submit" />
                    {/* <div className="separator"><div className="separator-text">or</div></div>
                    <Button title={Strings.login.googleLogin} onClick={logGoogleUser} isSocial isImage imagePath={googleLogo} /> */}
                </form>
                <div className="additional-actions">
                    <Button title={Strings.CreatePassword.title} isSecondary type="button" onClick={handleForgotPassword} />
                    <Button title={Strings.register.signUp} isSecondary type="button" onClick={handleSignUp} />
                    {loader && <Loader />}
                </div>
            </div>
        </div>
    )
};
export default Login;