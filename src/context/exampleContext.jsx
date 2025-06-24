import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// USAGE

// import { useContext } from "react";
// import { AuthContext } from "../contexts/AuthContext";

// const Profile = () => {
//   const { user, logout } = useContext(AuthContext);

//   if (!user) return <p>Please log in</p>;

//   return (
//     <div>
//       <p>Welcome, {user.name}!</p>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// };
