import { useState, useEffect } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:5000/api/users');
    setUsers(response.data);
  };

  const addUser = async () => {
    await axios.post('http://localhost:5000/api/users', { name, email, age });
    resetForm();
    fetchUsers();
  };

  const updateUser = async (id) => {
    await axios.put(`http://localhost:5000/api/users/${id}`, { name, email, age });
    resetForm();
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const sortedUsers = [...users].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  const filteredUsers = sortedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setName('');
    setEmail('');
    setAge('');
    setEditingUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      <div className="mb-6 flex items-center space-x-4">
        <input
          className="border border-gray-300 rounded-lg p-2 w-full md:w-1/3"
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
        />
        <button
          className={`bg-blue-500 text-white p-2 rounded-lg transition-transform duration-300 ease-in-out ${sortOrder === 'asc' ? 'hover:scale-105' : 'hover:scale-105'}`}
          onClick={handleSort}
        >
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <input
          className="border border-gray-300 rounded-lg p-2 w-full"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-lg p-2 w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border border-gray-300 rounded-lg p-2 w-full"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        {editingUser ? (
          <button
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
            onClick={() => updateUser(editingUser._id)}
          >
            Update User
          </button>
        ) : (
          <button
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
            onClick={addUser}
          >
            Add User
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {filteredUsers.map(user => (
          <li key={user._id} className="border border-gray-300 rounded-lg p-4 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
            <span className="text-lg font-medium">{user.name} - {user.email} - {user.age} years old</span>
            <div>
              <button
                className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 mr-2"
                onClick={() => {
                  setEditingUser(user);
                  setName(user.name);
                  setEmail(user.email);
                  setAge(user.age);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                onClick={() => deleteUser(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
