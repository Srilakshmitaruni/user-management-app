"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // 🔐 Protect Route
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn");
    if (!loggedIn) {
      router.push("/login");
    } else {
      fetchUsers();
    }
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  // Add or Update user
  const addUser = async () => {
    if (!name || !email) return alert("Fill all fields");

    if (editingId) {
      await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingId, name, email }),
      });
      setEditingId(null);
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });
    }

    setName("");
    setEmail("");
    fetchUsers();
  };

  // Delete user
  const deleteUser = async (id: number) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    fetchUsers();
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "60px auto",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        background: "#ffffff",
      }}
    >
      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          router.push("/login");
        }}
        style={{
          float: "right",
          background: "black",
          color: "white",
          border: "none",
          padding: "6px 10px",
          borderRadius: "5px",
        }}
      >
        Logout
      </button>

      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        User Management Dashboard
      </h1>

      {/* Form */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button
          onClick={addUser}
          style={{
            padding: "8px 12px",
            background: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "15px",
        }}
      />

      {/* Loading */}
      {loading && <p>Loading users...</p>}

      {/* User List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {users
          .filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((user) => (
            <li
              key={user.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <span>
                {user.name} - {user.email}
              </span>

              <div>
                <button
                  onClick={() => {
                    setName(user.name);
                    setEmail(user.email);
                    setEditingId(user.id);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteUser(user.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
