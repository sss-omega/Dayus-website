"use server";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const password = formData.get("password");
  if (password === "dauys2026") {
    cookies().set("admin_session", "authenticated", {
      httpOnly: true,
      secure: false, // Ensures it works on local HTTP
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "lax",
    });
    return true;
  }
  return false;
}
