import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../../API/adminRequests.js";

export default function OwnerUsersDashboard({ onBack }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await getUsers();
        if (isMounted) {
          setUsers(Array.isArray(response.users) ? response.users : []);
        }
      } catch (requestError) {
        console.error("Could not load user role controls:", requestError);
        if (isMounted) {
          setError(requestError.message || "تعذر تحميل المستخدمين.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (user, role) => {
    const userId = user._id || user.id;
    setBusyUserId(userId);
    setError("");
    try {
      const response = await updateUserRole(userId, role);
      setUsers((currentUsers) =>
        currentUsers.map((currentUser) =>
          (currentUser._id || currentUser.id) === userId
            ? response.user
            : currentUser,
        ),
      );
    } catch (requestError) {
      console.error("Could not change user role:", requestError);
      setError(requestError.message || "تعذر تغيير الصلاحية.");
    } finally {
      setBusyUserId("");
    }
  };

  return (
    <section className="relative z-10 space-y-5 font-cairo" dir="rtl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#737373]/25 pb-4">
        <div>
          <p className="font-oswald text-xs font-bold tracking-widest text-[#737373]">
            OWNER CONTROLS
          </p>
          <h1 className="mt-1 text-2xl font-black text-[#1a1a1a] sm:text-3xl">
            إدارة صلاحيات المستخدمين
          </h1>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border-2 border-[#4a4a4a] bg-[#737373] px-4 py-2 font-bold text-white transition hover:bg-[#5e5e5e]"
        >
          الرجوع للإعلانات
        </button>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-800">
          {error}
        </p>
      )}
      {isLoading ? (
        <p role="status" className="rounded-xl bg-white p-5 text-sm font-bold">
          جاري تحميل المستخدمين...
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const userId = user._id || user.id;

            return (
              <article
                key={userId}
                className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#737373]/30 bg-white p-4"
              >
                <div>
                  <h2 className="font-black">{user.name}</h2>
                  <p className="mt-1 text-sm text-[#555]">{user.email}</p>
                </div>
                <label className="text-sm font-bold">
                  الصلاحية
                  <select
                    value={user.role}
                    disabled={busyUserId === userId}
                    onChange={(event) =>
                      handleRoleChange(user, event.target.value)
                    }
                    className="mr-2 rounded-xl border border-[#737373]/40 bg-[#FFF4E6] px-3 py-2"
                  >
                    <option value="member">مستخدم</option>
                    <option value="admin">أدمن</option>
                  </select>
                </label>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
