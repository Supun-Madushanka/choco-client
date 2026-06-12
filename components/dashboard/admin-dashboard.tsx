export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        System Administrator Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">
            Total Users
          </h3>
          <p className="text-3xl font-bold">
            24
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">
            Active Users
          </h3>
          <p className="text-3xl font-bold">
            18
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">
            Roles
          </h3>
          <p className="text-3xl font-bold">
            3
          </p>
        </div>
      </div>
    </div>
  );
}