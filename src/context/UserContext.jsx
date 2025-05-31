import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  // Initialize state with data from localStorage
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      return JSON.parse(savedUsers);
    }
    return [];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
      return JSON.parse(savedCurrentUser);
    }
    return null;
  });

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Save current user to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Function to register a new user
  const registerUser = (userData) => {
    const userId = `user_${Date.now()}`;
    const newUser = {
      ...userData,
      id: userId,
      joinDate: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      favoriteItems: [],
      orderHistory: [],
      requests: []
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    return userId;
  };

  // Function to update an existing user
  const updateUser = (userId, updatedFields) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => 
        user.id === userId ? { ...user, ...updatedFields } : user
      );
      
      // If the current user is being updated, also update currentUser state
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...currentUser, ...updatedFields });
      }
      
      return updatedUsers;
    });
  };

  // Function to login a user
  const loginUser = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  // Function to logout the current user
  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Function to add a request/complaint
  const addUserRequest = (userId, requestData) => {
    const requestId = `req_${Date.now()}`;
    const newRequest = {
      ...requestData,
      id: requestId,
      date: new Date().toISOString(),
      status: 'Pending'
    };

    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            requests: [...(user.requests || []), newRequest]
          };
        }
        return user;
      });
    });

    return requestId;
  };

  // Function to update a user request
  const updateUserRequest = (userId, requestId, updatedFields) => {
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            requests: (user.requests || []).map(request => 
              request.id === requestId ? { ...request, ...updatedFields } : request
            )
          };
        }
        return user;
      });
    });
  };

  // Function to update order history when a new order is placed
  const updateOrderHistory = (userId, order) => {
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.id === userId) {
          const orderTotal = order.total || 0;
          return {
            ...user,
            totalOrders: (user.totalOrders || 0) + 1,
            totalSpent: (user.totalSpent || 0) + orderTotal,
            orderHistory: [...(user.orderHistory || []), order]
          };
        }
        return user;
      });
    });
  };

  return (
    <UserContext.Provider value={{
      users,
      currentUser,
      registerUser,
      updateUser,
      loginUser,
      logoutUser,
      addUserRequest,
      updateUserRequest,
      updateOrderHistory
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUsers = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};