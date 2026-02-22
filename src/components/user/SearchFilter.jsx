import { Search } from 'lucide-react';

const SearchFilter = ({ search, onSearchChange, statusFilter, onStatusChange }) => {
    return (
        <div className="bg-white p-4">
            <div className="flex gap-4 flex-wrap">
                {/* Search Input */}
                <div className="flex-1 min-w-[300px]">
                    <div className="relative bg-white-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>

                {/* Status Filter */}
                <div className="w-48">
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className={`w-full px-4 py-2 bg-white-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${statusFilter ==='all'?'text-[#ADADAD]':'text-black' }`}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SearchFilter;
