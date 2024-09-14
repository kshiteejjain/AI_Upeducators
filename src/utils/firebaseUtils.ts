import { collection, getDocs, query, where, DocumentData, QuerySnapshot, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';
type UserDocumentData = {
  total_credits?: number;
  remain_credits?: number;
  credits_limit_perday?: number;
  name?: string;
  categoryName?: string,
  description?: string,
  id?: number,
  redirect?: string,
  isBookmarked?: boolean,
  isActive?: boolean,
  email?: string,
  isActiveUser?: boolean,
  isAdmin?: boolean,
  password?: string
  timestamp?: any
  account_id?: any;
  isPaid?: boolean;
  batch?: string;
  count?: number
  creditsUsed?: number
  expiry?: string
};
export const fetchUserDocument = async (username: string): Promise<QuerySnapshot<DocumentData>> => {
  const collectionRef = collection(firestore, 'RegisteredUsers');
  const q = query(collectionRef, where('email', '==', username));
  const querySnapshot = await getDocs(q);
  return querySnapshot;
};
export const fetchTotalCredits = async (
  username: string,
  setTotalCredits?: React.Dispatch<React.SetStateAction<number>>,
  setRemainingCredits?: React.Dispatch<React.SetStateAction<number>>,
  setIsAdmin?: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  try {
    const querySnapshot = await fetchUserDocument(username);
    if (!querySnapshot.empty) {
      // Assuming there is only one document, directly access it
      const doc = querySnapshot.docs[0];
      const data = doc?.data() as UserDocumentData;
      if (setTotalCredits) {
        setTotalCredits((prevTotalCredits) => data?.total_credits || prevTotalCredits);
      }
      if (setRemainingCredits) {
        setRemainingCredits(data?.remain_credits || 0);
      }
      if (setIsAdmin) {
        const isAdminValue = data?.isAdmin;
        setIsAdmin(isAdminValue);
      }
    } else {
      // Handle the case when no document is found
      console.warn('No document found for the current user');
    }
  } catch (error) {
    alert('Error querying data from Firestore: ' + error);
  }
};
export const handleCreditDecrement = async (creditValue: number) => {
  try {
    const collectionRef = collection(firestore, 'RegisteredUsers');
    const q = query(
      collectionRef,
      where('email', '==', localStorage.getItem("username"))
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      querySnapshot.forEach(async (doc) => {
        const data = doc.data();
        const updatedRemainCredits = Math.max(0, (data?.remain_credits || 0) - creditValue);
        // Update the remain_credits in Firestore
        await updateDoc(doc.ref, {
          remain_credits: updatedRemainCredits,
        });
      });
    } else {
      alert('No document found for the current user');
    }
  } catch (error) {
    alert('Error updating data in Firestore: ' + error);
  }
};
export const fetchAllCategories = async (): Promise<any> => {
  try {
    const collectionRef = collection(firestore, 'Categories');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const categoryData = querySnapshot.docs.map((doc) => ({
      id: doc.data().id,
      name: doc.data().name,
      subCategories: doc.data().subCategories,
    }));
    return categoryData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};
export const fetchAllForms = async (): Promise<any> => {
  try {
    const collectionRef = collection(firestore, 'FormsList');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const categoryData = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      iconPath: doc.data().iconPath,
      categoryName: doc.data().categoryName,
      description: doc.data().description,
      id: doc.data().id,
      redirect: doc.data().redirect,
      isBookmarked: doc.data().isBookmarked,
      followupPrompts: doc.data().followupPrompts,
      keyword: doc.data().keyword,
      usageCount: doc.data().usageCount,
      usageCountBase: doc.data().usageCountBase,
      timeStamp: doc.data().timeStamp,
      thumbnailPath: doc.data().name,
      likes: doc.data().likes,
      dislikes: doc.data().dislikes,
      isActive: doc.data().isActive,
      isPaid: doc.data().isPaid
    }));
    return categoryData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};

export const fetchAllUserData = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'RegisteredUsers');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const userData = querySnapshot.docs.map((doc) => ({
      access_duration_days: doc.data().access_duration_days || 0,
      credits_limit_perday: doc.data().credits_limit_perday || 0,
      id: doc.data().id,
      name: doc.data().name,
      email: doc.data().email,
      batch: doc.data().batch,
      phone: doc.data().phone,
      plan: doc.data().plan,
      isActiveUser: doc.data().isActiveUser,
      isAdmin: doc.data().isAdmin,
      isFreeUser: doc.data().isFreeUser,
      isPrePaidUser: doc.data().isPrePaidUser,
      expiry: doc.data().expiry,
      register_timestamp: doc.data().register_timestamp,
      password: doc.data().password,
      remain_credits: doc.data().remain_credits || 0,
      total_credits: doc.data().total_credits || 0,
      campaignName: doc.data().campaignName || 'NA',
      campaignMedium: doc.data().campaignMedium || 'NA',
      campaignSource: doc.data().campaignSource || 'NA',
    }));
    return userData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};
export const freeTrialUsers = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'FreeTrialUsers');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const userData = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      email: doc.data().email,
      phone: doc.data().phone,
      password: doc.data().password,
      credit: doc.data().credit || 0,
      remain_credits: doc.data().remain_credits || 0,
      freeTrial: doc.data().freeTrial,
      register_timestamp: doc.data().register_timestamp,
      role: doc.data().role,
    }));
    return userData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};
export const categoryStats = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'CategoryStats');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const userData: UserDocumentData[] = [];
    querySnapshot.forEach((doc) => {
      const email = doc.id;
      const categories = doc.data();
      Object.keys(categories).forEach((categoryName) => {
        const { timestamp, count, name, creditsUsed } = categories[categoryName];
        userData.push({
          email,
          categoryName: name,
          timestamp,
          count,
          creditsUsed
        });
      });
    });
    return userData;
  } catch (error) {
    console.error('Error querying data from Firestore:', error);
    return [];
  }
};


export const OnBoardingProfile = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'OnboardingQuestions');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const OnBoardingProfileData = querySnapshot.docs.map((doc) => ({
      name: doc?.data()?.name,
      email: doc?.data()?.email,
      mobileCountryCode: doc?.data()?.mobileCountryCode,
      mobile: doc?.data()?.mobile,
      city: doc?.data()?.city,
      country: doc?.data()?.country,
      role: doc?.data()?.role,
      otherRole: doc?.data()?.otherRole,
      subjects: doc?.data()?.subjects,
      otherSubject: doc?.data()?.otherSubject,
      board: doc?.data()?.board,
      organization: doc?.data()?.organization,
    }));
    return OnBoardingProfileData;
  } catch (error) {
    console.error('Error querying OnBoarding Profile Data from Firestore:', error);
    return [];
  }
};

export const getPaymentDetails = async (firestore: Firestore): Promise<UserDocumentData[]> => {
  try {
    const collectionRef = collection(firestore, 'AIUpEducatorsPaidUsers');
    const querySnapshot = await getDocs(collectionRef);
    if (querySnapshot.empty) {
      return [];
    }
    const OnBoardingProfileData = querySnapshot.docs.map((doc) => ({
      date: doc.id,
      plan: doc?.data()?.payload?.payment?.entity?.notes?.plan,
      email: doc?.data()?.payload?.payment?.entity?.notes?.email,
    }));
    return OnBoardingProfileData;
  } catch (error) {
    console.error('Error querying OnBoarding Profile Data from Firestore:', error);
    return [];
  }
};