import PropTypes from 'prop-types';
import Strings from '../../localization/en';
import bookmarkIcon from '../../assets/bookmark.svg';

import './CategoryTiles.css';

type Props = {
    title: string;
    onClick: () => void;
    tilesIcon: string;
    description: string
}

const CategoryTiles = ({ title, onClick, tilesIcon, description }: Props) => {
    
    return (
        <div className='tiles' onClick={onClick}>
            <div className='tiles-icon'>
                <img src={tilesIcon} className='tilesIcon' />
                <img src={bookmarkIcon} className='bookmarkIcon' title={Strings.categories.Favorite} alt={Strings.categories.Favorite} />
            </div>
            <h1>{title}</h1>
            <p>{description}</p>
        </div>
    )
};

export default CategoryTiles;

CategoryTiles.propTypes = {
    title: PropTypes.string
};