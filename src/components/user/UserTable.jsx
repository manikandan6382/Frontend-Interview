import UserRow from './UserRow';
import {ChevronsUpDown } from 'lucide-react';

const USER_TITLES = ['S.L','Name' , 'Email', 'Initials' ,'Phone' ,'Role' ,'Status' ,'Title', 'Action']
const UserTable = ({ users, currentPage, usersPerPage, onStatusChange, onEdit, onDelete }) => {
    return (
        <div className="rounded-lg shadow overflow-hidden p-3 bg-white-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-b-20 border-white-4 mb-4 rounded-lg">
                        <tr>
                            {USER_TITLES.map((title , index) =>(
                                <th key={title}>
                                    <p className={`flex gap-2 items-center px-4 py-4 text-left bg-primary-dark text-white-2 font-medium uppercase tracking-wider my-2 ${index === 0 ? 'rounded-l-lg':index === USER_TITLES.length -1?'rounded-r-lg':''}`}>
                                        {title}
                                    <ChevronsUpDown className='h-5'/>
                                    </p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y-6 divide-white-4">
                        {users.map((user, index) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                serialNo={(currentPage - 1) * usersPerPage + index + 1}
                                onStatusChange={onStatusChange}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserTable;
