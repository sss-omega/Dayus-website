"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) return false;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return false;

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return false;

  cookies().set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "lax",
  });
  return true;
}

export async function logoutAction() {
  cookies().delete("admin_session");
  redirect("/login");
}
