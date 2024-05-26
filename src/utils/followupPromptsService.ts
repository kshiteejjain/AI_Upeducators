import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../utils/firebase';

async function getFollowupPrompts(selectedCategory: string) {
  try {
    const collectionRef = collection(firestore, 'FormsList');
    const q = query(collectionRef, where('redirect', '==', selectedCategory));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const followupPromptsData = querySnapshot.docs.map((doc) => doc.data().followupPrompts);

    return followupPromptsData.flat(); // Flatten the array of arrays into a single array of strings
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
}

async function getSuggestedForms(selectedCategory: string) {
  try {
    const collectionRef = collection(firestore, 'FormsList');
    const q = query(collectionRef, where('redirect', '==', selectedCategory));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    const suggestedFormsData = querySnapshot.docs.map((doc) => doc.data().suggestedForm);

    return suggestedFormsData.flat(); // Flatten the array of arrays into a single array of strings if necessary
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
}

export { getFollowupPrompts, getSuggestedForms };
