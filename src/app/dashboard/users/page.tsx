'use client';

import { useEffect,  useState } from 'react';
import { Input } from '@/components/ui/input';
import { useGetAllUsersQuery } from '@/redux/features/Users/userApi';
import Spinner from '@/components/Spinner';
import { PageContainer } from '@/components/shared/PageContainer';

import {
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationLink,
} from '@/components/ui/pagination';


const USERS_PER_PAGE = 6;

export default function AllUsersPage() {

  const { data, isLoading, isError } = useGetAllUsersQuery();

const users = data?.data?.data

const meta = data?.data?.meta ?? { totalPages: 1, total: 0, limit: 6, page: 1 }; // fallback meta

const totalPages = meta.totalPages ?? 1;  // default to 1 page if missing


  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<typeof users>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const searchTerm = search.trim().toLowerCase();

    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const filtered = users?.filter(
        (user) =>
          user?.name?.toLowerCase().includes(searchTerm) ||
          user?.email?.toLowerCase().includes(searchTerm) ||
          user?.phone?.toLowerCase().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    }
    setCurrentPage(1);
  }, [search, users]);


  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const currentUsers = filteredUsers?.slice(startIndex, startIndex + USERS_PER_PAGE);

  if (isLoading) return <Spinner />;
  if (isError)
    return <div className="text-center text-red-500 mt-10">Failed to load users.</div>;

  return (
    <PageContainer className="max-w-6xl">
      <h1 className="mb-6 text-center text-2xl font-bold sm:text-3xl">All Users</h1>

      <Input
        type="text"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-3 text-base max-w-sm mx-auto block"
      />

      <div className="w-full max-w-full overflow-x-auto rounded-lg border shadow">
        <table className="min-w-[640px] divide-y divide-gray-200">
          <caption className="sr-only">Registered users</caption>
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Phone
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers?.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              currentUsers?.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.phone}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6 justify-center flex">
          <PaginationPrevious
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationNext
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </Pagination>
      )}
    </PageContainer>
  );
}
