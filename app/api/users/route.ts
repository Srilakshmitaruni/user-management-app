import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET all users
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST - add new user
// DELETE - remove user by id
// UPDATE - modify user by id
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, email } = body;

    if (!id || !name || !email) {
      return NextResponse.json(
        { error: "ID, name and email are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *",
      [name, email, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
