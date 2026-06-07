/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const PRE_SEEDED_USERS = [
  {
    email: 'admin@lorafilm.com',
    password: '123456',
    fullName: 'Quản trị viên Lora',
    role: 'ADMIN'
  },
  {
    email: 'staff@lorafilm.com',
    password: '123456',
    fullName: 'Nhân viên Lora',
    role: 'EMPLOYEE'
  },
  {
    email: 'member@gmail.com',
    password: '123456',
    fullName: 'Dương Thiện Nhân',
    role: 'CUSTOMER'
  }
];

export function AuthProvider({ children }) {
  // Sync state initialization directly inside useState to avoid cascading render lint errors
  const [usersList, setUsersList] = useState(() => {
    const storedUsers = localStorage.getItem('lora_users');
    if (storedUsers) {
      try {
        const parsed = JSON.parse(storedUsers);
        const emailSet = new Set(PRE_SEEDED_USERS.map((u) => u.email));
        const customUsers = parsed.filter((u) => !emailSet.has(u.email));
        return [...PRE_SEEDED_USERS, ...customUsers];
      } catch (e) {
        console.error('Error parsing stored users', e);
      }
    }
    return PRE_SEEDED_USERS;
  });

  const [user, setUser] = useState(() => {
    const activeSession = localStorage.getItem('lora_session');
    if (activeSession) {
      try {
        return JSON.parse(activeSession);
      } catch (e) {
        console.error('Error parsing active session', e);
      }
    }
    return null;
  });

  const [userRole, setUserRole] = useState(() => {
    const activeSession = localStorage.getItem('lora_session');
    if (activeSession) {
      try {
        return JSON.parse(activeSession).role;
      } catch (e) {
        console.error('Error parsing active session role', e);
      }
    }
    return 'GUEST';
  });

  const login = (email, password) => {
    const matchedUser = usersList.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      return { success: false, message: 'Sai email hoặc mật khẩu đăng nhập!' };
    }

    const sessionUser = {
      email: matchedUser.email,
      fullName: matchedUser.fullName,
      role: matchedUser.role,
      phone: matchedUser.phone || '',
      gender: matchedUser.gender || 'NAM',
      dateOfBirth: matchedUser.dateOfBirth || ''
    };

    setUser(sessionUser);
    setUserRole(matchedUser.role);
    localStorage.setItem('lora_session', JSON.stringify(sessionUser));
    return { success: true, user: sessionUser };
  };

  const logout = () => {
    setUser(null);
    setUserRole('GUEST');
    localStorage.removeItem('lora_session');
  };

  const register = (fullName, email, password, phone, gender, dateOfBirth) => {
    const exists = usersList.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'Email này đã được sử dụng!' };
    }

    const newUser = {
      fullName,
      email: email.toLowerCase(),
      password,
      role: 'CUSTOMER',
      phone: phone || '',
      gender: gender || 'NAM',
      dateOfBirth: dateOfBirth || ''
    };

    const updatedList = [...usersList, newUser];
    setUsersList(updatedList);
    localStorage.setItem('lora_users', JSON.stringify(updatedList));
    return { success: true };
  };

  const updateUser = (updatedUserFields) => {
    if (!user) return;
    const updatedUser = { ...user, ...updatedUserFields };
    setUser(updatedUser);
    localStorage.setItem('lora_session', JSON.stringify(updatedUser));

    const updatedList = usersList.map((u) => {
      if (u.email.toLowerCase() === user.email.toLowerCase()) {
        return { ...u, ...updatedUserFields };
      }
      return u;
    });
    setUsersList(updatedList);
    localStorage.setItem('lora_users', JSON.stringify(updatedList));
  };

  const isAuthenticated = user !== null && userRole !== 'GUEST';

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        isAuthenticated,
        login,
        logout,
        register,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
