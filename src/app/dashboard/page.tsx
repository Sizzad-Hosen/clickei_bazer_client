import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Total Services</p>
            <h2 className="text-2xl font-semibold">128</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="text-2xl font-semibold">452</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <p className="text-gray-500">Active Users</p>
            <h2 className="text-2xl font-semibold">1,023</h2>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
          <p className="text-gray-600">No recent activity available.</p>
        </section>
      </div>
    </ProtectedRoute>
  );
}
