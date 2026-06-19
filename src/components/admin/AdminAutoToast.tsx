"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useToast } from "./AdminToast";

export default function AdminAutoToast() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Track parameters we already notified for to prevent loops
  const notifiedParams = useRef<string | null>(null);

  // 1. Listen to URL success params (from Next.js Server Action redirects)
  useEffect(() => {
    const successVal = searchParams.get("success");
    const paramKey = `${pathname}?success=${successVal}`;

    if (successVal && notifiedParams.current !== paramKey) {
      notifiedParams.current = paramKey;

      let msg = "Действие успешно выполнено!";
      let type: "success" | "warning" = "success";

      if (successVal === "created") {
        msg = "Успешно добавлено!";
      } else if (successVal === "updated") {
        msg = "Изменения успешно сохранены!";
      } else if (successVal === "deleted") {
        msg = "Успешно удалено!";
        type = "warning";
      }

      showToast(msg, type);

      // Clean the query parameter from URL quietly without reloading page
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("success");
        window.history.replaceState({}, "", url.pathname + url.search);
      }
    }
  }, [searchParams, pathname, showToast]);

  // 2. Catch form submit events to show instant pending toast
  useEffect(() => {
    const handleFormSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement;
      if (!form) return;

      const formData = new FormData(form);
      const action = formData.get("action") as string;
      const isDelete = action === "delete" || form.querySelector("button[type=submit]")?.textContent?.toLowerCase().includes("удалить");

      let pendingMessage = "Сохранение изменений...";
      if (action === "create") {
        pendingMessage = "Добавление нового элемента...";
      } else if (isDelete) {
        pendingMessage = "Выполняется удаление...";
      } else if (form.querySelector("button[type=submit]")?.textContent?.toLowerCase().includes("настройки")) {
        pendingMessage = "Сохранение настроек сайта...";
      } else if (form.id?.includes("knowledge") || form.outerHTML?.includes("ai-knowledge")) {
        pendingMessage = "Сохранение инструкций ИИ...";
      }

      showToast(pendingMessage, "info");
      
      // Since server actions reload/revalidate, if there is no redirect, we can show a success toast after a short delay
      // for forms that submit in-place (like admin settings page or categories page)
      if (pathname === "/admin" || pathname === "/admin/categories" || pathname === "/admin/ai") {
        setTimeout(() => {
          showToast("Действие выполнено успешно!", "success");
        }, 1200);
      }
    };

    document.addEventListener("submit", handleFormSubmit);
    return () => {
      document.removeEventListener("submit", handleFormSubmit);
    };
  }, [pathname, showToast]);

  return null;
}
