  import React, { useEffect, useState } from 'react';
  import { fetchAllCategories } from '../../utils/firebaseUtils';
  import Strings from '../../utils/en';
  import ChevronRight from '../../assets/chevron-right.svg';
  import './CategoriesFilter.css';

  type Prop = {
    onSelect?: (category: string) => void;
  };

  const CategoriesFilter: React.FC<Prop> = ({ onSelect }) => {
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>(
      localStorage.getItem('selectedCategory') || ''
    );
    const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
      localStorage.getItem('selectedSubcategory') || ''
    );
    const [showSubcategories, setShowSubcategories] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const categoryData = await fetchAllCategories();
          const formattedCategories = categoryData.map(({ id, name, subCategories }: any) => ({
            id,
            name,
            subCategories
          }));

          const allCategoryIndex = formattedCategories.findIndex(({ name }: any) => name === 'All');
          if (allCategoryIndex !== -1) {
            const allCategory = formattedCategories.splice(allCategoryIndex, 1)[0];
            formattedCategories.unshift(allCategory);
          }

          setCategories(formattedCategories);
        } catch (error) {
          alert(`Error fetching categories:', ${error}`);
        }
      };
      fetchData();
    }, []);

    const handleClickTarget = (clickedCategory: string, clickedSubcategory?: string) => {
      setSelectedCategory(clickedCategory);
      setSelectedSubcategory(clickedSubcategory || '');
      onSelect?.(clickedCategory);
      // setShowSubcategories(clickedSubcategory ? true : !showSubcategories);
      localStorage.setItem('selectedCategory', clickedCategory);
      clickedSubcategory
        ? localStorage.setItem('selectedSubcategory', clickedSubcategory)
        : localStorage.removeItem('selectedSubcategory');
    };

    const handleBookmarked = () => {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      localStorage.setItem('filterCategory', 'All');
      onSelect?.('Bookmarked', bookmarks);
    }
    
    return (
      <ul className="chipList">
        <li onClick={handleBookmarked}><strong><img src={ChevronRight} className="chevronRight" />  {Strings.categories.Bookmarked}</strong></li>
        {categories.sort((a, b) => a.id - b.id).map(({ name, subCategories }, index) => (
          <li key={index} className={selectedCategory === name ? 'active' : ''}>
            <strong onClick={() => handleClickTarget(name)}>
              <img src={ChevronRight} className="chevronRight" /> {name}
              {subCategories && subCategories.length > 0 && ` (${subCategories.length})`}
            </strong>
            {showSubcategories && subCategories && (
              <span className="subCategories">
                {subCategories.map((subCategory: string, subIndex: number) => (
                  <span key={subIndex} onClick={() => handleClickTarget(subCategory)}>
                    - {subCategory.trim()}
                  </span>
                ))}
              </span>
            )}
          </li>
        ))}
      </ul>
    );
  };

  export default CategoriesFilter;
