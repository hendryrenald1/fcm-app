import { db } from './firebase.utils';
import { doc, getDoc } from 'firebase/firestore';

// Fetch a single member by ID
export const fetchMemberById = async (memberId) => {
  try {
    const memberRef = doc(db, 'members', memberId);
    const memberSnapshot = await getDoc(memberRef);
    
    if (memberSnapshot.exists()) {
      return {
        id: memberSnapshot.id,
        ...memberSnapshot.data()
      };
    } else {
      console.log('No member found with ID:', memberId);
      return null;
    }
  } catch (error) {
    console.error('Error fetching member by ID:', error);
    throw error;
  }
};
