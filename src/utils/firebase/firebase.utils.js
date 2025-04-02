import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firestore functions
export const fetchMembers = async ({ pageSize = 10, page = 1, searchQuery = '' }) => {
  try {
    const membersRef = collection(db, 'members');
    const branchesRef = collection(db, 'branches');
    
    // First get all members and branches
    const [membersSnapshot, branchesSnapshot] = await Promise.all([
      getDocs(query(membersRef, orderBy('firstName', 'asc'))),
      getDocs(query(branchesRef))
    ]);

    // Create a map of branch data
    const branchMap = {};
    branchesSnapshot.forEach(doc => {
      branchMap[doc.id] = { id: doc.id, ...doc.data() };
    });
    
    // Map members and include branch data
    let filteredMembers = membersSnapshot.docs.map(doc => {
      const member = { id: doc.id, ...doc.data() };
      if (member.branchId && branchMap[member.branchId]) {
        member.branch = branchMap[member.branchId];
      }
      return member;
    });

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredMembers = filteredMembers.filter(member => {
        const firstName = member.firstName?.toLowerCase() || '';
        const lastName = member.lastName?.toLowerCase() || '';
        const email = member.email?.toLowerCase() || '';
        const branchName = member.branch?.name?.toLowerCase() || '';
        
        return firstName.includes(searchLower) ||
          lastName.includes(searchLower) ||
          email.includes(searchLower) ||
          branchName.includes(searchLower);
      });
    }

    // Calculate total and handle pagination
    const total = filteredMembers.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedMembers = filteredMembers.slice(start, end);

    return {
      members: paginatedMembers,
      total,
      limit: pageSize,
      skip: (page - 1) * pageSize
    };
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const fetchBranches = async ({ pageSize = 10, page = 1, searchQuery = '' }) => {
  try {
    const branchesRef = collection(db, 'branches');
    
    // First get all branches
    const q = query(branchesRef, orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    
    // Filter branches based on search query
    let filteredBranches = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filteredBranches = filteredBranches.filter(branch => 
        branch.name.toLowerCase().includes(searchLower)
      );
    }

    // Calculate total and handle pagination
    const total = filteredBranches.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedBranches = filteredBranches.slice(start, end);

    return {
      branches: paginatedBranches,
      total,
      limit: pageSize,
      skip: (page - 1) * pageSize
    };
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const signInUser = async (email, password) => {
  if (!email || !password) return;
  return await signInWithEmailAndPassword(auth, email, password);
};

export const fetchBranchById = async (branchId) => {
  try {
    const branchesRef = collection(db, 'branches');
    const q = query(branchesRef);
    const snapshot = await getDocs(q);
    const branch = snapshot.docs.find(doc => doc.id === branchId);
    return branch ? { id: branch.id, ...branch.data() } : null;
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => 
  onAuthStateChanged(auth, callback);

export const createMember = async (memberData) => {
  try {
    const membersRef = collection(db, 'members');
    const docRef = await addDoc(membersRef, {
      ...memberData,
      dateOfBirth: new Date(memberData.dateOfBirth),
      joinedOn: new Date(memberData.joinedOn),
      createdAt: new Date()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

export const updateMember = async (memberId, memberData) => {
  try {
    const memberRef = doc(db, 'members', memberId);
    await updateDoc(memberRef, {
      ...memberData,
      dateOfBirth: new Date(memberData.dateOfBirth),
      joinedOn: new Date(memberData.joinedOn),
      updatedAt: new Date()
    });
    return { id: memberId };
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

export const fetchAllBranches = async () => {
  try {
    const branchesRef = collection(db, 'branches');
    const branchesSnapshot = await getDocs(query(branchesRef, orderBy('name')));
    
    return branchesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const createBranch = async (branchData) => {
  try {
    const branchesRef = collection(db, 'branches');
    const docRef = await addDoc(branchesRef, {
      ...branchData,
      createdAt: new Date()
    });
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

export const updateBranch = async (branchId, branchData) => {
  try {
    const branchRef = doc(db, 'branches', branchId);
    await updateDoc(branchRef, {
      ...branchData,
      updatedAt: new Date()
    });
    return { id: branchId };
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};  