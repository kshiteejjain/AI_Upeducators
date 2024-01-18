import PropTypes from 'prop-types';
import Strings from '../../utils/en';
import bookmarkIcon from '../../assets/bookmark.svg'

import './CategoryTiles.css';

type Props = {
    title?: string;
    onClick?: () => void;
    tilesIcon?: string;
    description?: string;
    categoryAlt?: string;
    onBookmarkClick?: () => void;
}

const CategoryTiles = ({ title, onClick, tilesIcon, categoryAlt, description }: Props) => {

    return (
        <div className='tiles'>
            <img src={bookmarkIcon} className='bookmarkIcon' title={Strings.categories.Favorite} alt={Strings.categories.Favorite} />
            <img src={tilesIcon} className='tilesIcon' alt='Category Name' title={categoryAlt} />
            <div className='clickSection' onClick={onClick}>
                <div className='tiles-icon'>
                    <h1>{title}</h1>
                </div>
                <p>{description}</p>
            </div>
        </div>
    )
};

export default CategoryTiles;

CategoryTiles.propTypes = {
    title: PropTypes.string,
    onBookmarkClick: PropTypes.func,
};