import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser, changeUserStatus } from '../api/userApi';
import SearchFilter from '../components/user/SearchFilter';
import UserTable from '../components/user/UserTable';
import Pagination from '../components/user/Pagination';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import ConfirmModal from '../components/common/ConfirmModal';
import UserProfile from '../components/common/UserProfile';
import TableSkeleton from '../components/common/TableSkeleton';
import UserFormModal from '../components/user/UserFormModal';
import { Plus } from 'lucide-react';


function UserListPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [toast, setToast] = useState(null);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, userId: null });
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [userFormModal, setUserFormModal] = useState({ isOpen: false, userId: null });
    const usersPerPage = 10;

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await fetchUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = users.filter(user => {
        const matchSearch = 
            user.first_name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = 
            statusFilter === 'all' ? true :
            statusFilter === 'active' ? user.status === true :
            user.status === false;
        return matchSearch && matchStatus;
    });

    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);
    
    
    const handleStatusChange = async (id, currentStatus) => {
        try {
            const newStatus = currentStatus ? 0 : 1;
            await changeUserStatus(id, newStatus);
            loadUsers();
            setToast({ message: `Status changed to ${newStatus ? 'Active' : 'Inactive'} successfully!`, type: 'success' });
        } catch (error) {
            console.error('Failed to change status:', error);
            setToast({ message: 'Failed to change status', type: 'error' });
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteModal({ isOpen: true, userId: id });
    };

    const handleDeleteConfirm = async () => {
        try {
            setDeleteLoading(true);
            await deleteUser(deleteModal.userId);
            loadUsers();
            setToast({ message: 'User deleted successfully!', type: 'success' });
            setDeleteModal({ isOpen: false, userId: null });
        } catch (error) {
            console.error('Failed to delete user:', error);
            setToast({ message: 'Failed to delete user', type: 'error' });
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, userId: null });
    };
     if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold text-gray-800">Jobs Management</h1>
                            <SearchFilter
                            search={search}
                            onSearchChange={setSearch}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                                                />
                        </div>
                        <div className="flex items-center gap-4">
                            <Button 
                                variant="primary"
                                onClick={() => setUserFormModal({ isOpen: true, userId: null })}
                                Icon={Plus}
                            >
                                Add User
                            </Button>
                            <UserProfile />
                        </div>
                    
                    </div>


                    <TableSkeleton />
                </div>
            </div>
        );
    }

      return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
                            <SearchFilter
                            search={search}
                            onSearchChange={setSearch}
                            statusFilter={statusFilter}
                            onStatusChange={setStatusFilter}
                                                />
                        </div>
                        <div className="flex flex-col gap-4">
                            <UserProfile />
                            <Button 
                                variant="primary"
                                onClick={() => setUserFormModal({ isOpen: true, userId: null })}
                                Icon={Plus}
                                className={`flex items-center w-fit`}
                            >
                                Add User Users
                            </Button>
                        </div>
                    
                    </div>

                {/* User Table */}
                <UserTable
                    users={paginatedUsers}
                    currentPage={currentPage}
                    usersPerPage={usersPerPage}
                    onStatusChange={handleStatusChange}
                    onEdit={(id) => setUserFormModal({ isOpen: true, userId: id })}
                    onDelete={handleDeleteClick}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}

                {/* No results */}
                {filteredUsers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No users found
                    </div>
                )}
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Are you sure want to delete?"
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
                loading={deleteLoading}
            />

            <UserFormModal
                isOpen={userFormModal.isOpen}
                userId={userFormModal.userId}
                onClose={() => setUserFormModal({ isOpen: false, userId: null })}
                onSuccess={loadUsers}
            />
        </div>
    );
}

export default UserListPage;