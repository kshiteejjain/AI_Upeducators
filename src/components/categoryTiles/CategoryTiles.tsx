import { useEffect, useState } from 'react';
import { firestore } from '../../utils/firebase';
import { fetchAllForms } from '../../utils/firebaseUtils';
import Strings from '../../utils/en';
import graph from '../../assets/graph.svg'
import bookmarked from '../../assets/star.svg'
import logo from '../../assets/empty-state.gif';

import './CategoryTiles.css';

type Props = {
    id: number;
    title?: string;
    categoryName?: string;
    onClick?: () => void;
    tilesIcon?: string;
    description?: string;
    categoryAlt?: string;
    baseCount?: number;
    usageCountBase?: number;
    usageCount?: number,
    name?: string
    onBookmarkClick?: () => void;
    thumbnailPath?: string;
    bookmarkedIds: number[];
}
const CategoryTiles = ({ title, onClick, thumbnailPath = '/src/assets/Upeducator-logo.png', description, id = 0 }: Props) => {
    const [formCount, setFormCount] = useState<Props[]>([]);
    const [currentBookmarkedIds, setCurrentBookmarkedIds] = useState<number[]>([]);
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
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setCurrentBookmarkedIds(bookmarks);
    }, []);

    const toggleBookmark = (id: number) => {
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        if (id) {
            if (bookmarks.includes(id)) {
                bookmarks = bookmarks.filter((bookmarkId: number) => bookmarkId !== id);
            } else {
                bookmarks.push(id);
            }
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            setCurrentBookmarkedIds(bookmarks);
        }
    };

    return (
        <div className='tiles-group'>
            <div className='tiles' onClick={onClick}>
                <img src={thumbnailPath} className='list-img' />
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
                                        {item && item.usageCountBase && item.usageCount !== 0 ? (item?.usageCountBase + item?.usageCount) : item.usageCountBase}
                                    </span>

                                ))}

                            &nbsp;
                            {Strings.categories.people}
                        </strong>
                    </p>
                </div>
            </div>
            <span onClick={() => toggleBookmark(id)} className={currentBookmarkedIds.includes(id) ? 'bookmark bookmarked' : 'bookmark'}> <img src={bookmarked} alt="Bookmarked" className="bookmark-icon" /> </span>
        </div>
    )
};
export default CategoryTiles;