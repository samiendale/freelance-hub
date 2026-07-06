import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/admin/users', { params: { search } });
      setUsers(data.users);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user', err);
    }
  };

  return (
    <div className="admin-page animate-in">
      <h1 className="animate-in-d1">Manage Users</h1>
      <div className="admin-search animate-in-d2">
        <input
          className="form-input"
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="admin-table animate-in-d2">
        <thead>
          <tr className="admin-table-header">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="admin-table-row" key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
