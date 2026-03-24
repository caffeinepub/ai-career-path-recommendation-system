import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UserRole } from "../backend.d";
import { useActor } from "../hooks/useActor";

export default function AdminPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["isAdmin"],
    queryFn: () => actor!.isCallerAdmin(),
    enabled: !!actor,
  });

  const { data: users, isLoading: loadingUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      return await (actor as any).getAllUsers();
    },
    enabled: !!isAdmin && !!actor,
  });

  const claimAdminMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const success = await (actor as any).claimFirstAdmin();
      if (!success) throw new Error("Admin already exists or claim failed");
      return success;
    },
    onSuccess: () => {
      setIsError(false);
      setMessage("Admin access claimed! Refreshing...");
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: (err: Error) => {
      setIsError(true);
      setMessage(err.message || "Failed to claim admin access.");
    },
  });

  if (checkingAdmin || !actor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold text-indigo-800 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-500 mb-6">
            You don't have admin access yet. Click below to claim it.
          </p>
          {message && (
            <p
              className={`text-sm mb-4 ${isError ? "text-red-500" : "text-green-600"}`}
            >
              {message}
            </p>
          )}
          <button
            type="button"
            onClick={() => claimAdminMutation.mutate()}
            disabled={claimAdminMutation.isPending}
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition"
          >
            {claimAdminMutation.isPending
              ? "Claiming..."
              : "Claim Admin Access"}
          </button>
          <p className="text-xs text-gray-400 mt-4">
            Only the first user to claim becomes admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Admin Panel</h1>
        <p className="text-gray-500 mb-8">
          Manage users and view application data.
        </p>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">
            Registered Users
          </h2>
          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : users && users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-purple-50 text-indigo-700">
                    <th className="text-left p-3 rounded-tl-lg">Name</th>
                    <th className="text-left p-3">Email</th>
                    <th className="text-left p-3">Role</th>
                    <th className="text-left p-3">Assessments</th>
                    <th className="text-left p-3 rounded-tr-lg">Saved Jobs</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any, idx: number) => (
                    <tr
                      key={`${user.name}-${idx}`}
                      className="border-t border-gray-100 hover:bg-purple-50 transition"
                    >
                      <td className="p-3 font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="p-3 text-gray-600">{user.email || "—"}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === UserRole.admin
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
                        {user.completedAssessments?.length ?? 0}
                      </td>
                      <td className="p-3 text-gray-600">
                        {user.savedJobs?.length ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No user data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
