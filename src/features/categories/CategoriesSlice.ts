// CategoriesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CategoriesState {
  selectedCategory: string;
}

const initialState: CategoriesState = {
  selectedCategory: 'All', // Set default category
};

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { setCategory } = categoriesSlice.actions;
export const selectCategory = (state: { categories: CategoriesState }) => state.categories.selectedCategory;
export default categoriesSlice.reducer;
