"use client"

import ProtectedRoute from "@/components/ProtectedRoute";
import { useGetAllOrdersCountQuery, useGetAllOrdersQuery } from "@/redux/features/Order/ordersApi";
import { useGetAllServicesQuery } from "@/redux/features/Services/serviceApi";
import { useGetAllUsersQuery } from "@/redux/features/Users/userApi";
import { skipToken } from "@reduxjs/toolkit/query";

export default function DashboardPage() {
const { data: serviceAll } = useGetAllServicesQuery({});
const { data: AllUsers } = useGetAllUsersQuery();   

// if no args expected here
const { data: AllOrders } = useGetAllOrdersCountQuery();

console.log("AllOrders", AllOrders);

const userCount = AllUsers?.data?.data.length ?? 0; 

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Total Services</p>
            <h2 className="text-2xl font-semibold">{serviceAll?.data?.length ?? 0}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-semibold">{AllOrders?.data?.data?.length ?? 0}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Active Users</p>
            <h2 className="text-2xl font-semibold">{userCount}</h2>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
