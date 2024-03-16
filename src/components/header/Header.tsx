import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { fetchAllUserData, fetchTotalCredits } from '../../utils/firebaseUtils';
import Button from '../buttons/Button';
import Strings from '../../utils/en';
import logo from '../../assets/Upeducator-logo.png';
import defaultProfile from '../../assets/defaultProfile.svg';

import './Header.css';


type Props = {
  isLoginPage?: boolean;
  onClick?: () => void;
  moreOptions?: boolean;
};

const Header = ({ isLoginPage, moreOptions = true }: Props) => {
  const [isExpire, setIsExpire] = useState(false);
  const [username, setUsername] = useState('');
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const showUsername = (name: string) => {
    const email = name.split('@');
    return email[0];
  };
  const toggleCreditDetails = () => {
    setShowCreditDetails(!showCreditDetails);
  };
  const handleLogout = () => {
    navigate('/');
    localStorage.clear();
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem('username') ?? 'User';
        setUsername(showUsername(storedUsername));
        // Fetch only setRemainingCredits
        await fetchTotalCredits(storedUsername, undefined, setRemainingCredits, setIsAdmin);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors as needed
      }
    };
    fetchData();

    const fetchUserData = async () => {
      try {
        const usersData = await fetchAllUserData(firestore);
        const loggedInUserEmail = localStorage.getItem('username');
        const loggedInUser = usersData.find(user => user.email === loggedInUserEmail);

        const registrationTimestamp = loggedInUser?.register_timestamp;

        if (registrationTimestamp) {
          const registrationDate = new Date(registrationTimestamp);
          const currentDate = new Date();

          // Set isExpire state
          const isSameDay = currentDate.getFullYear() === registrationDate.getFullYear() &&
            currentDate.getMonth() === registrationDate.getMonth() &&
            currentDate.getDate() === registrationDate.getDate();

          // If currentDate and registrationDate are the same day, don't mark as expired
          if (!isSameDay) {
            setIsExpire(!(currentDate < registrationDate));
          }
          console.log('currentDate', currentDate)
          console.log('registrationDate', registrationDate)
        } else {
          console.log('Registration timestamp not available.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    if (isExpire) {
      navigate('/ContactUs');
    }

    if (remainingCredits !== undefined && remainingCredits <= 0) {
      navigate('/ContactUs');
    }
  }, [remainingCredits, navigate, isExpire]);


  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} />
        <div className="headerRight">
          {isAdmin && <nav>
            <button onClick={() => navigate('/Dashboard')}>{Strings.header.admin}</button>
          </nav>}
          <div className="username" onClick={toggleCreditDetails}> {Strings.header.welcome} &nbsp; <span> {username} </span>
            <span className='defaultProfile'><img src={defaultProfile} /> </span>
          </div>
          <div className={`creditDetails ${showCreditDetails ? 'visible' : 'hidden'}`}>
            {moreOptions && !isExpire &&
              <>
                {remainingCredits !== undefined && remainingCredits > 0
                  ? (
                    <p>
                      <Button title={Strings.header.goToCategory} isSecondary onClick={() => navigate('/Categories')} />
                    </p>
                  )
                  : null
                }
                <p><Button title={Strings.header.myProfile} isSecondary onClick={() => navigate('/Profile')} /></p>
              </>}

            {isLoginPage ?? <Button title={Strings.header.signOut} isSecondary onClick={handleLogout} />}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
Header.propTypes = {
  isLoginPage: PropTypes.bool,
};
