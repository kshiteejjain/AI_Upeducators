import React, { useEffect, useState } from 'react';
import CategoriesAPI from "../../localization/categories.json";

import './CategoriesFilter.css';

type CategoriesFilterType = {
  IconComponent: string | undefined;
  name: string;
  iconPath: string;
};

type CategoriesFilterProps = {
  categories: CategoriesFilterType[];
  onSelect: (category: string) => void;
};

const CategoriesFilter: React.FC<CategoriesFilterProps> = () => {
  const [categories, setCategories] = useState<CategoriesFilterType[]>([]);

  const getIconPath = async (iconPath: string) => {
    try {
        const iconModule = await import(`../../assets/${iconPath}.svg`);
        return iconModule.default;
    } catch (error) {
        console.error(`Error loading icon ${iconPath}:`, error);
        return null;
    }
};

  useEffect(() => {
    const fetchData = async () => {
        try {
            const formattedCategories = await Promise.all(
                CategoriesAPI.categories.map(async (item) => ({
                    name: item.name,
                    IconComponent: await getIconPath(item.iconPath),
                }))
            );
            setCategories(formattedCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    fetchData();
}, []);

  return (
    <ul className="chipList">
      {categories.map((item, index) => (
        <li key={index}>
          <img src={item.IconComponent} alt={`${item.iconPath}`} className="category-icon" />
          {item.name}
        </li>
      ))}
    </ul>
  );
};

export default CategoriesFilter;
