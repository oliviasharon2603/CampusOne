import React, { createContext, useContext, useState } from 'react';

const UserActivityContext = createContext();

export const useUserActivity = () => useContext(UserActivityContext);

export const UserActivityProvider = ({ children }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [transportPass, setTransportPass] = useState(null);

  const borrowBook = (bookId) => {
    if (!borrowedBooks.includes(bookId)) {
      setBorrowedBooks(prev => [...prev, bookId]);
    }
  };

  const registerEvent = (eventId) => {
    if (!registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => [...prev, eventId]);
    }
  };

  const joinClub = (clubId) => {
    if (!joinedClubs.includes(clubId)) {
      setJoinedClubs(prev => [...prev, clubId]);
    }
  };

  const applyForPass = (passDetails) => {
    setTransportPass(passDetails);
  };

  return (
    <UserActivityContext.Provider value={{
      borrowedBooks, borrowBook,
      registeredEvents, registerEvent,
      joinedClubs, joinClub,
      transportPass, applyForPass
    }}>
      {children}
    </UserActivityContext.Provider>
  );
};
