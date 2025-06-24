const API_URL = "https://jsonplaceholder.typicode.com";

export const fetchUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return response.json();
};

// USAGE

// import { fetchUsers } from "../services/api";
// import { useEffect, useState } from "react";

// const UserList = () => {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetchUsers().then(setUsers);
//   }, []);

//   return (
//     <ul>
//       {users.map((user) => (
//         <li key={user.id}>{user.name}</li>
//       ))}
//     </ul>
//   );
// };
