"use client";

import React, { useState } from "react";
import CustomerServiceLayout from "@/components/customer-service/CustomerServiceLayout";
import { ROUTES } from "@/utils/routes";

export default function ProfileView() {
  const breadcrumbs = [
    { name: "Trang chủ", href: ROUTES.HOME },
    { name: "Dịch vụ khách hàng", href: null },
    { name: "Tài khoản của tôi", href: null },
  ];

  const [name, setName] = useState("Vũ Thanh Mai");
  const [phone, setPhone] = useState("0934213874");
  const [email, setEmail] = useState("thanhhaiceramics@gmail.com");
  const [gender, setGender] = useState("female"); // 'female' or 'male'
  const [birthYear, setBirthYear] = useState("1950");

  const handleSave = (e) => {
    e.preventDefault();
    alert("Lưu thay đổi hồ sơ cá nhân thành công!");
  };

  return (
    <CustomerServiceLayout breadcrumbs={breadcrumbs}>
      {/* Title */}
      <h1 className="font-arima text-[#2E2F2A] text-[36px] font-[400] leading-[40px] mb-6">
        Tài khoản của tôi
      </h1>

      {/* Main Profile Card */}
      <div className="w-full max-w-[920px] bg-white border-[0.5px] border-[#909090] rounded-[6px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] pt-[17px] pb-[24px] px-4 md:px-[89px] mb-6 font-montserrat">
        {/* Card Header Title */}
        <h2 className="text-center font-montserrat font-[700] text-[16px] text-[#C76E00] uppercase leading-[40px] mb-[30px]">
          Hồ sơ cá nhân
        </h2>

        <form onSubmit={handleSave} className="flex flex-col">
          {/* Name Row */}
          <div className="flex flex-col md:flex-row md:items-center mb-[19px]">
            <label className="w-full md:w-[121px] font-montserrat font-[600] text-[12px] text-[#2E2F2A] shrink-0 mb-1 md:mb-0">
              Họ tên*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full max-w-[592px] h-[35px] border-[0.5px] border-[#909090] rounded-[5px] bg-white px-3 font-montserrat font-[400] text-[12px] text-[#2E2F2A] focus:outline-none"
            />
          </div>

          {/* Phone Row */}
          <div className="flex flex-col md:flex-row md:items-center mb-[19px]">
            <label className="w-full md:w-[121px] font-montserrat font-[600] text-[12px] text-[#2E2F2A] shrink-0 mb-1 md:mb-0">
              Số điện thoại
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full max-w-[592px] h-[35px] border-[0.5px] border-[#909090] rounded-[5px] bg-white px-3 font-montserrat font-[400] text-[12px] text-[#2E2F2A] focus:outline-none"
            />
          </div>

          {/* Email Row */}
          <div className="flex flex-col md:flex-row md:items-center mb-[29px]">
            <label className="w-full md:w-[121px] font-montserrat font-[600] text-[12px] text-[#2E2F2A] shrink-0 mb-1 md:mb-0">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full max-w-[592px] h-[35px] border-[0.5px] border-[#909090] rounded-[5px] bg-white px-3 font-montserrat font-[400] text-[12px] text-[#2E2F2A] focus:outline-none"
            />
          </div>

          {/* Gender Row */}
          <div className="flex flex-col md:flex-row md:items-center mb-[29px]">
            <label className="w-full md:w-[121px] font-montserrat font-[600] text-[12px] text-[#2E2F2A] shrink-0 mb-1 md:mb-0">
              Giới tính
            </label>
            <div className="flex items-center gap-[30px] h-[35px]">
              {/* Female Choice */}
              <label className="flex items-center gap-2 cursor-pointer font-montserrat font-[300] text-[14px] text-[#2E2F2A] select-none">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="hidden"
                />
                <span className="w-[15px] h-[15px] rounded-full border border-[#2E2F2A] flex items-center justify-center shrink-0">
                  {gender === "female" && (
                    <span className="w-[9.38px] h-[9.38px] rounded-full bg-[#2E2F2A]" />
                  )}
                </span>
                <span className="leading-[40px]">Nữ</span>
              </label>

              {/* Male Choice */}
              <label className="flex items-center gap-2 cursor-pointer font-montserrat font-[300] text-[14px] text-[#2E2F2A] select-none">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="hidden"
                />
                <span className="w-[15px] h-[15px] rounded-full border border-[#2E2F2A] flex items-center justify-center shrink-0">
                  {gender === "male" && (
                    <span className="w-[9.38px] h-[9.38px] rounded-full bg-[#2E2F2A]" />
                  )}
                </span>
                <span className="leading-[40px]">Nam</span>
              </label>
            </div>
          </div>

          {/* Birth Year Row */}
          <div className="flex flex-col md:flex-row md:items-center mb-[20px]">
            <label className="w-full md:w-[121px] font-montserrat font-[600] text-[12px] text-[#2E2F2A] shrink-0 mb-1 md:mb-0">
              Năm sinh
            </label>
            <input
              type="text"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="w-full max-w-[592px] h-[35px] border-[0.5px] border-[#909090] rounded-[5px] bg-white px-3 font-montserrat font-[400] text-[12px] text-[#2E2F2A] focus:outline-none"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-[197px] h-[35px] mx-auto flex items-center justify-center bg-[#C76E00] hover:bg-[#a65c00] rounded-[5px] text-white font-montserrat font-[700] text-[16px] transition duration-200 cursor-pointer mt-4"
          >
            Lưu thay đổi
          </button>
        </form>
      </div>
    </CustomerServiceLayout>
  );
}
