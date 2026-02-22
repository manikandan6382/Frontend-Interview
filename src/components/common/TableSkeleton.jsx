const TableSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Initials</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {[...Array(10)].map((_, index) => (
                        <tr key={index} className="animate-pulse">
                            <td className="px-6 py-4">
                                <div className="h-4 w-8 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div className="ml-3 h-4 w-32 bg-gray-200 rounded"></div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-6 w-11 bg-gray-200 rounded-full"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                                    <div className="h-5 w-5 bg-gray-200 rounded"></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
