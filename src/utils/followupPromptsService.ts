import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '../utils/firebase';

async function getFollowupPrompts(selectedCategory: string | undefined) {
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

export { getFollowupPrompts };
