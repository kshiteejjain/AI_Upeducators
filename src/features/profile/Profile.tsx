import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { firestore } from '../../utils/firebase';
import { categoryStats, fetchTotalCredits, OnBoardingProfile, fetchAllUserData, getPaymentDetails } from '../../utils/firebaseUtils';
import { setCategory } from '../categories/CategoriesSlice';
import Header from '../../components/header/Header';
import Strings from '../../utils/en';

import './Profile.css';
import Button from '../../components/buttons/Button';

interface UserData {
    expiry: string;
    remain_credits: number;
    plan: string;
    email: string;
    name: string;
    phone: number;
    total_credits: number;
    categoryName: string;
    count: number;
    creditsUsed: number
    timestamp: string | number;
    mobileCountryCode: number;
    mobile: number;
    city: string;
    country: string;
    role: string;
    otherRole: string;
    subjects: string;
    otherSubject: string;
    board: string;
    organization: string;
}

const Profile: React.FC = () => {
    const [username, setUsername] = useState('');
    const [statsData, setStatsData] = useState<UserData[]>([]);
    const [isOnboardingData, setIsOnboardingData] = useState<UserData[]>([]);
    const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
    const [isAdmin, setIsAdmin] = useState(false);
    const [allUserData, setAllUserData] = useState<UserData[]>([]);
    const [paymentDetails, setPaymentDetails] = useState<UserData[]>([]);
    const [startIndex, setStartIndex] = useState(0);
    const [displayedItems, setDisplayedItems] = useState<UserData[]>([]);
    const [totalHistoryItems, setTotalHistoryItems] = useState<UserData[]>([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUsername = localStorage.getItem('username') ?? 'User';
                setUsername(showUsername(storedUsername));

                // Fetch stats data based on logged-in user
                const data = await categoryStats(firestore);
                setStatsData(data.filter(item => item.email === storedUsername));

                // Fetch remaining credits and check admin status
                await fetchTotalCredits(storedUsername, undefined, setRemainingCredits, setIsAdmin);

                // Fetch onboarding profile data
                const profileData = await OnBoardingProfile(firestore, storedUsername);
                setIsOnboardingData(profileData);

                // Fetch all user data
                const allUserData = await fetchAllUserData(firestore);
                setAllUserData(allUserData);

                // Fetch payment details
                const userPaymentDetails = await getPaymentDetails(firestore);
                setPaymentDetails(userPaymentDetails);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors as needed
            }
        };

        fetchData();
    }, []);

    const showUsername = (name: string) => {
        const email = name.split('@');
        return email[0];
    };

    useEffect(() => {
        const fetchData = async () => {
            const storedUsername = localStorage.getItem('username') ?? 'User';
            const data = await categoryStats(firestore);
            setStatsData(data.filter(item => item.email === storedUsername));
        };

        fetchData();
    }, []);

    useEffect(() => {
        const loggedUserEmail = localStorage.getItem('username') ?? 'User';
        const statsDataFiltered = statsData
            .filter((item) => item.email === loggedUserEmail)
            .sort((a, b) => {
                const timestampA = new Date(a.timestamp).getTime();
                const timestampB = new Date(b.timestamp).getTime();
                return timestampB - timestampA;
            });

        const endIndex = Math.min(startIndex + 10, statsDataFiltered.length);
        const itemsToShow = statsDataFiltered.slice(startIndex, endIndex);
        setDisplayedItems(itemsToShow);
        setTotalHistoryItems(statsDataFiltered)
    }, [startIndex, statsData]);

    const nextItems = () => {
        if (startIndex + 10 < statsData.length) {
            setStartIndex(startIndex + 10);
        }
    };

    const previousItems = () => {
        if (startIndex - 10 >= 0) {
            setStartIndex(startIndex - 10);
        }
    };

    const handleTile = (categoryName: string) => {
        dispatch(setCategory(categoryName));
        navigate(`/GeneratorAndResult/${categoryName}`);
    };

    return (
        <>
            <Header />
            <div className='wrapper'>
                <div className='profile-flex'>
                    <div className='profile-cards'>
                        <h2> Profile </h2>
                        <table className='table'>
                            <tbody>
                                {allUserData
                                    .filter((item) => item.email === localStorage.getItem('username'))
                                    .map((user, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <th>Username</th>
                                                <td>{user.name}</td>
                                            </tr>
                                            <tr>
                                                <th>Registered Mobile</th>
                                                <td>{user.phone}</td>
                                            </tr>
                                            <tr>
                                                <th>Subscribed Plan</th>
                                                <td>{user.plan}</td>
                                            </tr>
                                            {/* Add more rows for other properties as needed */}
                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='profile-cards'>
                        <h2> Usage </h2>
                        <p>{Strings.profile.upgrade}: <a href='https://upeducators.ai/pricing/'> {Strings.profile.upgradePlan} </a></p>

                        <table className='table'>
                            <tbody>
                                {allUserData
                                    .filter((item) => item.email === localStorage.getItem('username'))
                                    .map((user, index) => (
                                        <React.Fragment key={index}>
                                            <tr>
                                                <th>Total Credits</th>
                                                <td>{user.total_credits}</td>
                                            </tr>
                                            <tr>
                                                <th>Remaining Credits</th>
                                                <td>{user.remain_credits}</td>
                                            </tr>
                                            <tr>
                                                <th>Expiry Date</th>
                                                <td>{user.expiry.split('-').reverse().join('-')}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className='profile-flex'>
                    <div className='profile-cards'>
                        <h2> Corporate Details </h2>
                        <div className='tableWrapper'>
                            <table className='table'>
                                <tbody>
                                    {isOnboardingData
                                        .filter((item) => item.email === localStorage.getItem('username') ?? 'User')
                                        .map((item, index) => (
                                            <React.Fragment key={index}>
                                                <tr>
                                                    <th>Name</th>
                                                    <td>{item?.name}</td>
                                                </tr>
                                                <tr>
                                                    <th>Email</th>
                                                    <td>{item?.email}</td>
                                                </tr>
                                                <tr>
                                                    <th>Mobile</th>
                                                    <td>{item?.mobileCountryCode} - {item?.mobile}</td>
                                                </tr>
                                                <tr>
                                                    <th>City</th>
                                                    <td>{item?.city}</td>
                                                </tr>
                                                <tr>
                                                    <th>Country</th>
                                                    <td>{item?.country}</td>
                                                </tr>
                                                <tr>
                                                    <th>Role</th>
                                                    <td>{item?.role} {item?.otherRole}</td>
                                                </tr>
                                                <tr>
                                                    <th>Subjects</th>
                                                    <td>{item?.subjects} {item?.otherSubject}</td>
                                                </tr>
                                                <tr>
                                                    <th>Board</th>
                                                    <td>{item?.board}</td>
                                                </tr>
                                                <tr>
                                                    <th>Organization</th>
                                                    <td>{item?.organization}</td>
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='profile-cards'>
                        <h2> Search History ({totalHistoryItems.length})</h2>
                        <div className='tableWrapper'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Query Count</th>
                                        <th>Credits Used</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td onClick={() => handleTile(item.categoryName)}>
                                                <span className='link'>{item.categoryName}</span>
                                            </td>
                                            <td>{item.count}</td>
                                            <td>{item.creditsUsed}</td>
                                            <td>{item.timestamp}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='pagination'>
                                <p className='pagination-count'>Showing items {startIndex + 1} to {Math.min(startIndex + 10, displayedItems.length)} of <span>total {totalHistoryItems.length}</span></p>
                                <div>
                                    <Button isSecondary title='Previous' onClick={previousItems} isDisabled={startIndex === 0} />
                                    <Button isSecondary title="Next" onClick={nextItems} isDisabled={startIndex + 10 >= statsData.length} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className='profile-cards'>
                    <h2> Payment History </h2>
                    <div className='tableWrapper'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>Payment Date</th>
                                    <th>Plan Name</th>
                                    <th>Plan Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentDetails
                                    .filter((item) => item.payload?.payment?.entity?.notes?.email === localStorage.getItem('username') ?? 'User')
                                    .map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.plan}</td>
                                            <td>{item.count}</td>
                                            <td>{item.timestamp}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div> */}
            </div>
        </>
    );
};

export default Profile;
