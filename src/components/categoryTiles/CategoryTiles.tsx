import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { fetchAllForms } from '../../utils/firebaseUtils';
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
    usageCountBase?: number;
    usageCount? : number,
    name? : string
    onBookmarkClick?: () => void;
}
const CategoryTiles = ({ title, onClick, categoryAlt, description }: Props) => {
    const [formCount, setFormCount] = useState<Props[]>([]);
    const [thumbnailSrc, setThumbnailSrc] = useState(null);
    const truncatedStory = description ?
        (description.length > 10 ? description.split(' ').slice(0, 8).join(' ') + '...' : description)
        : '';

    useEffect(() => {
        const fetchData = async () => {
            try {

                const formData = await fetchAllForms(firestore);
                setFormCount(formData);
            } catch (error) {
                console.error('Error fetching category stats:', error);
            }
        };

        fetchData(); // Call fetchData function on component mount
    }, []);

    useEffect(() => {
        const fetchThumbnail = async () => {
            try {
                const imagePath = `../../../../public/assets/${title?.split(' ').join('-')}.png`;
                const { default: thumbnail } = await import(imagePath);
                setThumbnailSrc(thumbnail);
            } catch (error) {
                console.error('Error fetching thumbnail:', error);
            }
        };

        fetchThumbnail();

        // Cleanup function
        return () => {
            setThumbnailSrc(null); // Clear thumbnail source on component unmount
        };
    }, [title]); 
    

    return (
        <div className='tiles-group'>
            <div className='tiles' onClick={onClick}>
            {thumbnailSrc && <img src={thumbnailSrc} className='list-img' />}
                {/* <img src={bookmarkIcon} className='bookmarkIcon' title={Strings.categories.Favorite} alt={Strings.categories.Favorite} /> */}
                <div className='clickSection'>
                    <div className='tiles-icon'>
                        <h1 title={title}>{title}</h1>
                    </div>
                    <p title={truncatedStory}>{truncatedStory}</p>
                    <p className='usedBy'>
                        <img src={graph} className='graph' />
                        {Strings.categories.usedBy}
                        <strong>
                            {formCount
                                .filter((item) => item && item.name && item.name.toLowerCase().replace(/\s/g, '') === (title ? title.toLowerCase().replace(/\s/g, '') : ''))
                                .map((item, index) => (
                                    <span key={index}>
                                        {item && item.usageCountBase && item.usageCount && (item.usageCountBase + item.usageCount)}
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