import { db } from './firebase.utils';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';

// Enhanced fetchBranches function that includes pastor details
export const fetchBranchesWithPastors = async ({ pageSize = 10, page = 1, searchQuery = '' }) => {
  try {
    const branchesRef = collection(db, 'branches');
    const membersRef = collection(db, 'members');
    
    // Get all branches
    const branchesSnapshot = await getDocs(query(branchesRef, orderBy('name', 'asc')));
    
    // Map branches and prepare for pastor data
    let branches = branchesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filter branches if search query exists
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      branches = branches.filter(branch => 
        branch.name?.toLowerCase().includes(searchLower) ||
        branch.city?.toLowerCase().includes(searchLower) ||
        branch.country?.toLowerCase().includes(searchLower)
      );
    }
    
    // Fetch pastor details for each branch
    const branchesWithPastors = await Promise.all(
      branches.map(async (branch) => {
        if (branch.pastorId) {
          try {
            const pastorDoc = await getDoc(doc(membersRef, branch.pastorId));
            if (pastorDoc.exists()) {
              const pastorData = pastorDoc.data();
              return {
                ...branch,
                pastorName: `${pastorData.firstName || ''} ${pastorData.lastName || ''}`.trim(),
                pastor: {
                  id: pastorDoc.id,
                  ...pastorData
                }
              };
            }
          } catch (error) {
            console.error(`Error fetching pastor for branch ${branch.id}:`, error);
          }
        }
        return {
          ...branch,
          pastorName: 'No Pastor Assigned'
        };
      })
    );
    
    // Calculate pagination
    const total = branchesWithPastors.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedBranches = branchesWithPastors.slice(start, end);
    
    return {
      branches: paginatedBranches,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error('Error fetching branches with pastors:', error);
    throw error;
  }
};
