import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Button from "../buttons/Button";
import Strings from '../../localization/en';
import logo from '../../assets/Upeducator-logo.png';

import './Header.css';

type Props = {
  isLoginPage?: boolean;
  onClick?: () => void;
}

const Header = ({isLoginPage}: Props) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };
  
  return (
    <header className="header">
      <div className='container'>
        <img src={logo} alt={Strings.header.metaTitle} title={Strings.header.metaTitle} />
        {isLoginPage ?? <Button title={Strings.header.signOut} onClick={handleLogout} /> }
      </div>
    </header>
  );
};

export default Header;

Header.propTypes = {
  isLoginPage: PropTypes.bool,
};
