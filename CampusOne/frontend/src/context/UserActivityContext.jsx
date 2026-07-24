import React, { createContext, useContext, useState, useEffect } from 'react';

const UserActivityContext = createContext();

export const useUserActivity = () => useContext(UserActivityContext);

export const UserActivityProvider = ({ children }) => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [transportPass, setTransportPass] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [dbUserId, setDbUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const addCalendarEvent = (eventDate) => {
    setCalendarEvents(prev => prev.includes(eventDate) ? prev : [...prev, eventDate]);
  };

  useEffect(() => {
    import('../firebase').then(({ auth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const res = await fetch('http://localhost:5000/api/v1/users/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: user.photoURL
                })
              });
              const data = await res.json();
              if (data.success) {
                setDbUserId(data.userId);
                setUserName(user.displayName || 'Student');
                setUserEmail(user.email || '');
                
                // Fetch user stats
                const statsRes = await fetch(`http://localhost:5000/api/v1/users/${data.userId}/stats`);
                const statsData = await statsRes.json();
                if (statsData.success) {
                  setRegisteredEvents(statsData.data.registeredEvents);
                  setBorrowedBooks(statsData.data.borrowedBooks);
                  setJoinedClubs(statsData.data.joinedClubs);
                }
              }
            } catch (err) {
              console.error('Error syncing user:', err);
            }
          } else {
            setDbUserId(null);
            setUserName(null);
            setUserEmail(null);
          }
        });
      });
    });
  }, []);

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
      transportPass, applyForPass,
      calendarEvents, addCalendarEvent,
      dbUserId, userName, userEmail
    }}>
      {children}
    </UserActivityContext.Provider>
  );
};
