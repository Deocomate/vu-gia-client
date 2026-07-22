"use client";

import { useEffect, useRef, useState } from "react";
import { useCustomerAuthStore } from "@/shared/stores/customer-auth-store";
import { toast } from "@/utils/feedback";

// Gated on the user-provisioned Google Web client id — no `google-*` npm
// dependency, loads Google Identity Services directly (per Phase 2 scope).
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let gsiScriptPromise = null;

function loadGsiScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Sign-In chỉ chạy trên trình duyệt."));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }
  if (!gsiScriptPromise) {
    gsiScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GSI_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        gsiScriptPromise = null;
        reject(new Error("Không thể tải Google Sign-In."));
      };
      document.head.appendChild(script);
    });
  }
  return gsiScriptPromise;
}

/**
 * Renders the Google Identity Services "Sign in with Google" button.
 * Renders nothing when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is unset — the
 * committed deliverable is a working Google sign-in, gated on the env var
 * the user provisions (Phase 2 Validation Decisions).
 */
export default function GoogleLoginButton({ onSuccess, className = "" }) {
  const buttonRef = useRef(null);
  const [scriptLoading, setScriptLoading] = useState(true);
  const googleLogin = useCustomerAuthStore((state) => state.googleLogin);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return undefined;
    }

    let cancelled = false;

    loadGsiScript()
      .then(() => {
        if (cancelled || !window.google?.accounts?.id || !buttonRef.current) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (credentialResponse) => {
            try {
              await googleLogin(credentialResponse.credential);
              onSuccess?.();
            } catch (error) {
              toast.error(error.message || "Đăng nhập Google không thành công.");
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "rectangular",
          text: "continue_with",
          width: 360,
          locale: "vi",
        });

        setScriptLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setScriptLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [googleLogin, onSuccess]);

  if (!GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className={`w-full flex flex-col items-center gap-2 ${className}`}>
      <div className="flex w-full items-center gap-3 text-[#A7A7A7]" aria-hidden="true">
        <span className="h-px flex-1 bg-[#E6E8EC]" />
        <span className="text-[12px] font-montserrat">hoặc</span>
        <span className="h-px flex-1 bg-[#E6E8EC]" />
      </div>
      <div ref={buttonRef} className="flex w-full justify-center" />
      {scriptLoading && (
        <p className="font-montserrat text-[12px] text-[#A7A7A7]">Đang tải Google Sign-In...</p>
      )}
    </div>
  );
}
