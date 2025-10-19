'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext'; // Import the custom hook

export default function LogoutButton() {
  const { currentUser, handleLogout, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    // Optionally return null or a skeleton during the loading check
    return null; 
  }

  // Hide the button if the user is NOT logged in
  if (!currentUser) {
    return null;
  }
  
  const onClickLogout = async () => {
      await handleLogout();
      // Redirect to login or home after successful logout
      router.push('/login'); 
  }

  return (
    <button
      onClick={onClickLogout}
      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium"
    >
      Logout ({currentUser.email})
    </button>
  );
}