import PropTypes from 'prop-types';

import './Button.css';

type Props = {
    title?: string;
    onClick?: () => void;
    type?: string;
}

const Button = ({ title, onClick }: Props) => {
    return (
        <button className='button' onClick={onClick}>
            {title}
        </button>
    )
};

export default Button;

Button.propTypes = {
    title: PropTypes.string
};