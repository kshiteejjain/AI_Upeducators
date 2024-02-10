import React, { useEffect, useState } from 'react';
import { fetchAllCategories } from '../../utils/firebaseUtils';
import ChevronRight from '../../assets/chevron-right.svg';
import './CategoriesFilter.css';
type Prop = {
  IconComponent?: string | undefined;
  name?: string;
  iconPath?: string;
  category?: string
  onSelect?: (category: string) => void;
  showIcon?: boolean;
};
const CategoriesFilter: React.FC<Prop> = ({ onSelect, showIcon }) => {
  const [categories, setCategories] = useState<Prop[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('selectedCategory') || '';
  });
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(() => {
    return localStorage.getItem('selectedSubcategory') || '';
  });
  const [showSubcategories, setShowSubcategories] = useState(false);

  const getIconPath = async (iconPath: string) => {
    try {
      const iconModule = await import(`../../assets/${iconPath}.svg`);
      return iconModule.default;
    } catch (error) {
      alert(`Error loading icon ${iconPath}: ${error}`);
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryData = await fetchAllCategories();
        const iconPathsData = await Promise.all(categoryData.map(async (category: Prop) => {
          const path = category.iconPath ? await getIconPath(category.iconPath) : null;
          return { [category.name]: path };
        }));
        const iconPathsObject = Object.assign({}, ...iconPathsData);
        const formattedCategories = categoryData.map((category) => ({
          name: category.name,
          IconComponent: iconPathsObject[category.name],
          subCategories: category.subCategories
        }));
        const allCategoryIndex = formattedCategories.findIndex(category => category.name === 'All');
        if (allCategoryIndex !== -1) {
          const allCategory = formattedCategories.splice(allCategoryIndex, 1)[0];
          formattedCategories.unshift(allCategory);
        }
        setCategories(formattedCategories);
      } catch (error) {
        alert('Error fetching categories:', error);
      }
    };
    fetchData();
  }, []);
  const handleClickTarget = (clickedCategory: string, clickedSubcategory?: string) => {
    setSelectedCategory(clickedCategory);
    setSelectedSubcategory(clickedSubcategory || ''); // If subcategory is provided, set it; otherwise, set an empty string
    onSelect(clickedCategory);
    const categoryWithSubcategories = categories.find((category) => category.name === clickedCategory);
    setSelectedCategory(clickedCategory);
    setSelectedSubcategory(clickedSubcategory || '');
    if (categoryWithSubcategories && categoryWithSubcategories.subCategories.length > 0) {
      setShowSubcategories((prev) => !prev);
    }
    localStorage.setItem('selectedCategory', clickedCategory);
    if (clickedSubcategory) {
      localStorage.setItem('selectedSubcategory', clickedSubcategory);
    } else {
      localStorage.removeItem('selectedSubcategory'); // Clear the subcategory if not provided
    }
  };
  return (
    <ul className="chipList">
      {categories.map((item, index) => (
        <li key={index} className={selectedCategory === item.name ? 'active' : ''}>
          {showIcon && <img src={item.IconComponent} alt={`${item.iconPath}`} className="category-icon" />}
          <strong onClick={() => handleClickTarget(item.name)}>
            <img src={ChevronRight} className='chevronRight' /> {item.name}
            {item.subCategories.length > 0 && ` (${JSON.parse(item.subCategories).length})`}
          </strong>
          {showSubcategories && item.subCategories.length > 0 && (
            <span className='subCategories'>
              {JSON.parse(item.subCategories).map((subCategory, subIndex) => (
                <span key={subIndex}>
                  <span onClick={() => handleClickTarget(subCategory)}>- {subCategory.replace('DM_', '')}</span>
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
