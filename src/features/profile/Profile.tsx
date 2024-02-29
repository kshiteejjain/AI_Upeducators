import React from 'react';
import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { categoryStats, fetchTotalCredits, OnBoardingProfile } from '../../utils/firebaseUtils';
import { setCategory } from '../categories/CategoriesSlice';
import Header from '../../components/header/Header';
import Strings from '../../utils/en';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import './Profile.css';



const Profile = () => {
    const [username, setUsername] = useState('');
    const [statsData, setStatsData] = useState([]);
    const [isOnboardingData, setIsOnboardingData] = useState([]);
    const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
    const [isAdmin, setIsAdmin] = useState(false);
    const showUsername = (name: string) => {
        const email = name.split('@');
        return email[0];
    };
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await categoryStats(firestore); // Fetch data from categoryStats function
                setStatsData(data);
            } catch (error) {
                console.error('Error fetching category stats:', error);
            }
        };

        fetchData(); // Call fetchData function on component mount
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedUsername = localStorage.getItem('username') ?? 'User';
                setUsername(showUsername(storedUsername));
                // Fetch only setRemainingCredits
                await fetchTotalCredits(storedUsername, undefined, setRemainingCredits, setIsAdmin);
                // Fetch data from OnBoardingProfileData
                const profileData = await OnBoardingProfile(firestore, storedUsername);
                setIsOnboardingData(profileData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors as needed
            }
        };
        fetchData();
        if (remainingCredits !== undefined && remainingCredits <= 0) {
        }
    }, [remainingCredits]);

    const handleTile = (categoryName: string) => {
        dispatch(setCategory(categoryName));
        navigate('/GeneratorAndResult');
    };

    return (
        <>
            <Header />
            <div className='wrapper'>
                <div className='profile-flex'>
                    <div className='profile-cards'>
                        <h2> Profile </h2>
                        <p>{Strings.header.email}: {localStorage.getItem('username')}</p>
                        <p>{Strings.header.remainingCredits} {remainingCredits}</p>
                    </div>
                    <div className='profile-cards'>
                        <h2> Search History </h2>
                        <div className='tableWrapper'>
                            <table className='table'>
                                <thead>
                                    <tr>
                                        <th>Form Name</th>
                                        <th>Usage</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsData
                                        .filter((item) =>
                                            item.user === localStorage.getItem('username') ?? 'User')
                                        .map((item, index) => {
                                            // Split the category name by uppercase letters and join with spaces
                                            const formattedCategoryName = item.categoryName
                                                .split(/(?=[A-Z])/)
                                                .join(' ');
                                            return (
                                                <tr key={index}>
                                                    <td onClick={() => handleTile(item.categoryName)}><span className='link'>{formattedCategoryName}</span></td>
                                                    <td>{item.count}</td>
                                                    <td>{item.timeStamp}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='profile-flex'>
                    <div className='profile-cards'>
                        <h2> Your Profile </h2>
                        <div className='tableWrapper'>
                            <table className='table'>
                                <tbody>
                                    {isOnboardingData
                                        .filter((item) =>
                                            item.email === localStorage.getItem('username') ?? 'User')
                                        .map((item, index) => {
                                            return (
                                                <React.Fragment key={index}><tr>
                                                    <th>Name</th>
                                                    <td>{item?.name}</td>
                                                </tr><tr>
                                                        <th>Email</th>
                                                        <td>{item?.email}</td>
                                                    </tr><tr>
                                                        <th>Mobile</th>
                                                        <td>{item?.mobileCountryCode} - {item?.mobile}</td>
                                                    </tr><tr>
                                                        <th>City</th>
                                                        <td>{item?.city}</td>
                                                    </tr><tr>
                                                        <th>Country</th>
                                                        <td>{item?.country}</td>
                                                    </tr><tr>
                                                        <th>Role</th>
                                                        <td>{item?.role} {item?.otherRole}</td>
                                                    </tr><tr>
                                                        <th>Subjects</th>
                                                        <td>{item?.subjects} {item?.otherSubject}</td>
                                                    </tr><tr>
                                                        <th>Board</th>
                                                        <td>{item?.board}</td>
                                                    </tr><tr>
                                                        <th>Organization</th>
                                                        <td>{item?.organization}</td>
                                                    </tr></React.Fragment>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
};
export default Profile;