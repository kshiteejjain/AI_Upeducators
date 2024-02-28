import { useEffect, useState } from "react";
import { firestore } from '../../../utils/firebase';
import { OnBoardingProfile } from '../../../utils/firebaseUtils';

const OnBoardingProfileQuestions = () => {
    const [isOnboardingData, setIsOnboardingData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileData = await OnBoardingProfile(firestore);
                setIsOnboardingData(profileData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle errors as needed
            }
        };
        fetchData();
    }, []);


    return (
        <div className='section'>
            <div className='sectionHeader'>
                <h1>Users Onboarding Profile ({isOnboardingData?.length})</h1>
            </div>
            <div className='tableWrapper'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>City</th>
                            <th>Country</th>
                            <th>Role</th>
                            <th>Subjects</th>
                            <th>Board</th>
                            <th>Organization</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isOnboardingData
                            .map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{item?.name}</td>
                                        <td>{item?.email}</td>
                                        <td>{item?.mobileCountryCode} {item?.mobile}</td>
                                        <td>{item?.city}</td>
                                        <td>{item?.country}</td>
                                        <td>{item?.role} {item?.otherRole}</td>
                                        <td>{item?.subjects} {item?.otherSubject}</td>
                                        <td>{item?.board}</td>
                                        <td>{item?.organization}</td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default OnBoardingProfileQuestions;