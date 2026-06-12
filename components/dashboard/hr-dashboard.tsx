export default function HRDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        HR Manager Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">
            Employees
          </h3>
          <p className="text-3xl font-bold">
            120
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">
            Present Today
          </h3>
          <p className="text-3xl font-bold">
            105
          </p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold">
            Pending Leaves
          </h3>
          <p className="text-3xl font-bold">
            7
          </p>
        </div>
      </div>
    </div>
  );
}