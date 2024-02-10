import PropTypes from 'prop-types';
import CircleImg from '../../assets/circle.svg';

import './AdminCards.css';
type Props = {
    title?: string;
    value?: string;
    bgColor?: string;
}
const AdminCards = ({ title, value, bgColor }: Props) => {
    const getGradientClass = (bgColor) => {
        switch (bgColor) {
            case 'one':
                return 'bg-gradient-danger';
            case 'two':
                return 'bg-gradient-info';
            case 'three':
                return 'bg-gradient-success';
            default:
                return '';
        }
    };
    const gradientClass = getGradientClass(bgColor);
    return (
        <div className='sectionCards'>
            <div className={`card card-img-holder ${gradientClass}`}>
                <div className="card-body">
                    <img src={CircleImg} className="card-img-absolute" alt="circle" />
                    <h4>{title}</h4>
                    <h2>{value}</h2>
                </div>
            </div>
        </div>
    );
};
AdminCards.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    bgColor: PropTypes.oneOf(['one', 'two', 'three']).isRequired,
};
export default AdminCards;
