"use client";

import { Toaster } from "sonner";
import "sonner/dist/styles.css";

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      richColors={false}
      closeButton
      duration={3500}
      toastOptions={{
        classNames: {
          toast:
            "font-montserrat text-[14px] border shadow-[0px_4px_4px_rgba(0,0,0,0.15)] rounded-[6px]",
          title: "font-semibold text-[#2E2F2A]",
          description: "text-[#777E90]",
          success: "bg-white border-success/30 text-[#2E2F2A]",
          error: "bg-white border-sale/40 text-[#2E2F2A]",
          info: "bg-white border-primary/30 text-[#2E2F2A]",
          warning: "bg-white border-[#C76E00]/40 text-[#2E2F2A]",
          closeButton:
            "border-[#E1DEDE] bg-white text-[#909090] hover:bg-[#FAF7F7]",
        },
      }}
      style={{ zIndex: 100 }}
    />
  );
}
