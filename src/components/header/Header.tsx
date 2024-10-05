import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { fetchAllUserData, fetchTotalCredits } from '../../utils/firebaseUtils';
import Button from '../buttons/Button';
import Strings from '../../utils/en';
import logo from '../../assets/Upeducator-logo.png';
import chevron from '../../assets/chevron-right.svg';

import './Header.css';

type Props = {
  isLoginPage?: boolean;
  onClick?: () => void;
  moreOptions?: boolean;
  expiry?: string
};

const Header = ({ isLoginPage, moreOptions = true }: Props) => {
  const [isExpire, setIsExpire] = useState(false);
  const [username, setUsername] = useState('');
  const [remainingCredits, setRemainingCredits] = useState<number | undefined>(undefined);
  const [showCreditDetails, setShowCreditDetails] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english');
  const navigate = useNavigate();

  const toggleCreditDetails = () => {
    setShowCreditDetails(!showCreditDetails);
  };
  const handleLogout = () => {
    const bookmarkedItems = localStorage.getItem('bookmarks');
    localStorage.clear();
    if (bookmarkedItems) {
      localStorage.setItem('bookmarks', bookmarkedItems);
    }
    navigate('/');
  };

  useEffect(() => {
    const fetchLanguage = localStorage.getItem('upEdu_prefix');
    const data = fetchLanguage ? JSON.parse(fetchLanguage) : {};
    const storedLanguage = data.lang || 'english'; // Default to 'english'
    setSelectedLanguage(storedLanguage);

    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem('username') ?? 'User';
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
        const expiry = loggedInUser?.expiry;
        setUsername((loggedInUser?.name ?? '').split(' ').map(name => name[0]).join(''));
        if (expiry) {
          const currentDate = new Date();
          const expiryDate = new Date(expiry);

          if (expiryDate < currentDate) {
            setIsExpire(true);
            navigate('/ContactUs');
          }
        } else {
          console.log('Expiry date not available.');
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

  const handleLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    // Retrieve existing data from localStorage
    const existingData = localStorage.getItem('upEdu_prefix');

    // Parse the data to an object
    let data = existingData ? JSON.parse(existingData) : {};

    // Update the lang property
    data.lang = selectedLanguage;

    // Save the updated object back to localStorage
    localStorage.setItem('upEdu_prefix', JSON.stringify(data));
    window.location.reload()
  };


  return (
    <header className="header">
      <div className="container">
        <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} onClick={() => navigate('/')} />
        {username &&
          <div className="headerRight">

            <div className='language-selection'>
              <select className='form-control' value={selectedLanguage} onChange={handleLanguage}>
                <option value='english'>English</option>
                <option value='hindi'>Hindi</option>
                <option value='marathi'>Marathi</option>
                <option value='bengali'>Bengali</option>
                <option value='tamil'>Tamil</option>s
                <option value='telugu'>Telugu</option>
                <option value='kannada'>Kannada</option>
                <option value='malayalam'>Malayalam</option>
                <option value='gujarati'>Gujarati</option>
                <option value='french'>French</option>
                <option value='german'>German</option>
                <option value='spanish'>Spanish</option>
              </select>
            </div>


            <div className='headerRight-others'>
              <p> Remaining Credits: <strong>{remainingCredits}</strong></p>
              <p><a href='https://upeducators.ai/pricing/'> {Strings.profile.upgradePlan} </a></p>
            </div>

            {isAdmin && <nav>
              <button onClick={() => navigate('/Dashboard')}>{Strings.header.admin}</button> &nbsp;&nbsp;&nbsp;&nbsp;
              <button onClick={() => navigate('/AddSuperUser')}>Add Super User</button>
            </nav>}

            <div className={`username ${showCreditDetails ? 'visible' : 'hidden'}`} onClick={toggleCreditDetails}> <span className='circle'>{username} </span> <img src={chevron} /> </div>

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
                  <p><Button title={Strings.header.usage} isSecondary onClick={() => navigate('/Profile')} /></p>
                </>}

              {isLoginPage ?? <Button title={Strings.header.signOut} isSecondary onClick={handleLogout} />}
            </div>
          </div>
        }
      </div>
    </header >
  );
};
export default Header;
Header.propTypes = {
  isLoginPage: PropTypes.bool,
};
