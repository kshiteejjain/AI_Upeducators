import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { firestore } from '../../utils/firebase';
import { categoryStats } from '../../utils/firebaseUtils';
import Strings from '../../utils/en';
import bookmarkIcon from '../../assets/bookmark.svg'
import graph from '../../assets/graph.svg'
import './CategoryTiles.css';

type Props = {
    title?: string;
    categoryName?: string;
    onClick?: () => void;
    tilesIcon?: string;
    description?: string;
    categoryAlt?: string;
    baseCount?: number;
    count?: number;
    onBookmarkClick?: () => void;
}
const CategoryTiles = ({ title, onClick, tilesIcon, categoryAlt, description }: Props) => {
    const [statsData, setStatsData] = useState<Props[]>([]);
    const truncatedStory = description ?
        (description.length > 10 ? description.split(' ').slice(0, 8).join(' ') + '...' : description)
        : '';

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

    return (
        <div className='tiles-group'>
            <div className='tiles' onClick={onClick}>
                <img src="https://images.pexels.com/photos/8617961/pexels-photo-8617961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" className='list-img' />
                {/* <img src={bookmarkIcon} className='bookmarkIcon' title={Strings.categories.Favorite} alt={Strings.categories.Favorite} /> */}
                {/* <img src={tilesIcon} className='tilesIcon' alt='Category Name' title={categoryAlt} /> */}
                <div className='clickSection'>
                    <div className='tiles-icon'>
                        <h1 title={title}>{title}</h1>
                    </div>
                    <p title={truncatedStory}>{truncatedStory}</p>
                    <p className='usedBy'>
                        <img src={graph} className='graph' />
                        {Strings.categories.usedBy}
                        <strong>
                            {statsData
                                .filter((item) => item?.categoryName?.toLowerCase()?.replace(/\s/g, '') === (title ? title.toLowerCase().replace(/\s/g, '') : ''))
                                .map((item, index) => (
                                    <span key={index}>
                                        {typeof item?.baseCount === 'number' && typeof item?.count === 'number' ? item.baseCount + item.count : ''}
                                    </span>
                                ))}
                            &nbsp;
                            {Strings.categories.people}
                        </strong>
                    </p>
                </div>
            </div>
        </div>
    )
};
export default CategoryTiles;
CategoryTiles.propTypes = {
    title: PropTypes.string,
    onBookmarkClick: PropTypes.func,
};