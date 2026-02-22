import { Edit, Trash2 } from 'lucide-react';

const UserRow = ({ user, serialNo, onStatusChange, onEdit, onDelete }) => {
    return (
        <tr className="hover:bg-gray-50">
            {/* S.No */}
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {serialNo}
            </td>

            {/* Name with Avatar */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <img
                        src={user.profile_image_url}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-3">
                        <div className="text-sm font-medium">
                            {user.first_name} {user.last_name}
                        </div>
                    </div>
                </div>
            </td>

            {/* Email */}
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.email}
            </td>

            {/* Initials */}
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.initials || '-'}
            </td>

            {/* Phone */}
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.phone || '-'}
            </td>

            {/* Role */}
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.role.title}
            </td>

            {/* Status Toggle */}
            <td className="px-6 py-4 whitespace-nowrap">
                <button
                    onClick={() => onStatusChange(user.id, user.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${user.status ? 'bg-primary' : 'bg-[#D9D9D9]'
                        }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full  transition-transform ${user.status ? 'translate-x-6 bg-[#D9D9D9]' : 'translate-x-1 bg-primary'
                            }`}
                    />
                </button>
            </td>

            {/* Title */}
            <td className="px-6 py-4 whitespace-nowrap text-sm">
                {user.title || '-'}
            </td>

            {/* Actions */}
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                    >
                        <Edit className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default UserRow;
