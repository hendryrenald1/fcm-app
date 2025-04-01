import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { Navigation } from './routes/navigation/navigation.component';
import Home from './routes/home/home.component';
import Members from './routes/members/members.component';
import Login from './routes/login/login.component';
import Branches from './routes/branches/branches.component';
import MemberAdd from './components/member-add/member-add.component';
import { onAuthStateChangedListener } from './utils/firebase/firebase.utils';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Navigation />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<Home />} />
          <Route path="members" element={<Members />} />
          <Route path="add-member" element={<MemberAdd />} />
          <Route path="branches" element={<Branches />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
