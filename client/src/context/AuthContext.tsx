'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types';
import apiClient from '@/lib/api/axios';

/**
 * ============================================
 * AUTH CONTEXT - PURPOSE & WORKING
 * ============================================
 * 
 * PURPOSE:
 * - Yeh file user authentication manage karti hai
 * - Login, Register, Logout sab yahaan se handle hota hai
 * - Har component mein user ki info easily access kar sakte ho
 * 
 * HOW IT WORKS:
 * 1. User login/register karta hai → API call hota hai
 * 2. API se response milta hai → User data state mein save hota hai
 * 3. Har component useAuth() hook use karke user info access kar sakta hai
 * 4. Page refresh par cookie se user info automatically load ho jata hai
 * 
 * FLOW:
 * Login → API Call → Token Cookie → User State → All Components Access
 */

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // State Variables - User ki current status track karti hain
  const [user, setUser] = useState<User | null>(null); // Current logged in user
  const [isAuthenticated, setIsAuthenticated] = useState(false); // User logged in hai ya nahi
  const [isLoading, setIsLoading] = useState(true); // Data loading hai ya nahi

  /**
   * ============================================
   * HELPER FUNCTION - User Data Save Karo
   * ============================================
   * Yeh function user data ko state aur localStorage mein save karta hai
   * Repeat code avoid karne ke liye use hota hai
   */
  const saveUserData = (userData: any) => {
    const user: User = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      createdAt: userData.createdAt || new Date().toISOString(),
    };
    setUser(user);
    setIsAuthenticated(true);
    // localStorage sirf browser mein available hai
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };

  /**
   * ============================================
   * AUTO USER CHECK - Page Load Par
   * ============================================
   * Jab bhi page refresh hota hai, yeh check karta hai ki user logged in hai ya nahi
   * 
   * FLOW:
   * 1. Pehle localStorage se user data load karo (fast, immediate UI) - sirf browser mein
   * 2. Phir API se verify karo (actual authentication check)
   * 3. Agar API fail ho, to localStorage clear karo
   */
  const checkCurrentUser = async () => {
    try {
      // STEP 1: DIRECT API se verify karo (localStorage se load nahi karte - avoid stale data)
      // IMPORTANT: Pehle API se verify karo, phir UI dikhao
      const response = await apiClient.get('/api/auth/me');
      
      // STEP 2: Agar API successful hai, to fresh data save karo
      if (response.data.success && response.data.user) {
        saveUserData(response.data.user);
      } else {
        // API ne user data nahi diya, to clear karo
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
        }
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // STEP 3: API fail ho gaya, to clear karo (user logged in nahi hai)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      // STEP 4: Loading complete - ab UI dikha sakte ho
      setIsLoading(false);
    }
  };

  // Page load par automatically user check karo
  useEffect(() => {
    checkCurrentUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * ============================================
   * LOGIN FUNCTION - User Login
   * ============================================
   * IMPLEMENTATION:
   * 1. Email aur password API ko bhejte hain
   * 2. API response se user data milta hai
   * 3. Token cookie mein automatically save ho jata hai (backend se)
   * 4. User data state mein save karte hain
   * 
   * API: POST /api/auth/login
   * Body: { email, password }
   * Response: { success: true, user: {...}, token: "..." }
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API Call
      const response = await apiClient.post('/api/auth/login', {
        email: email.trim(),
        password: password,
      });

      // Success case - user data save karo
      if (response.data.success && response.data.user) {
        saveUserData(response.data.user);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login Error:', error);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * ============================================
   * ADMIN LOGIN FUNCTION - Admin Login
   * ============================================
   * IMPLEMENTATION:
   * 1. Same login API use hota hai
   * 2. Response mein role check karte hain
   * 3. Agar role "admin" hai, to login successful
   * 4. Warna login fail
   * 
   * API: POST /api/auth/login (same as user login)
   * Body: { email, password }
   * Response: { success: true, user: { role: "admin" }, token: "..." }
   */
  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API Call - same login API
      const response = await apiClient.post('/api/auth/login', {
        email: email.trim(),
        password: password,
      });

      // Check karo user admin hai ya nahi
      if (response.data.success && response.data.user) {
        if (response.data.user.role !== 'admin') {
          setIsLoading(false);
          return false; // Admin nahi hai
        }
        
        // Admin hai - data save karo
        saveUserData(response.data.user);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Admin Login Error:', error);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * ============================================
   * REGISTER FUNCTION - New User Register
   * ============================================
   * IMPLEMENTATION:
   * 1. Name, email, phone, password API ko bhejte hain
   * 2. Backend user create karta hai database mein
   * 3. Token cookie mein automatically save ho jata hai
   * 4. User automatically logged in ho jata hai (register ke baad)
   * 
   * API: POST /api/auth/register
   * Body: { name, email, phone, password }
   * Response: { success: true, user: {...}, token: "..." }
   */
  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // API Call
      const response = await apiClient.post('/api/auth/register', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password: password,
      });

      // Success case - user data save karo (auto login)
      if (response.data.success && response.data.user) {
        saveUserData(response.data.user);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Register Error:', error);
      setIsLoading(false);
      return false;
    }
  };

  /**
   * ============================================
   * LOGOUT FUNCTION - User Logout
   * ============================================
   * IMPLEMENTATION:
   * 1. API call karte hain (cookie clear ho jayega backend se)
   * 2. Frontend se bhi user data clear karte hain
   * 3. User logged out ho jata hai
   * 
   * API: POST /api/auth/logout
   * Response: { success: true }
   */
  const logout = async () => {
    try {
      // API Call - cookie clear ho jayega
      await apiClient.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout Error:', error);
    } finally {
      // Frontend se bhi clear karo
      setUser(null);
      setIsAuthenticated(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  /**
   * ============================================
   * CONTEXT PROVIDER
   * ============================================
   * Yeh sab functions aur state expose karta hai
   * Kisi bhi component mein useAuth() hook se access kar sakte ho
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        register,
        adminLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * ============================================
 * CUSTOM HOOK - useAuth
 * ============================================
 * Yeh hook kisi bhi component mein use kar sakte ho
 * Example: const { user, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
