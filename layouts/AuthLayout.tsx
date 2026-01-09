import React from "react";
import { BrandLogo } from "../components/UI";
import { useI18n } from "../hooks/useI18n";

const AuthLayout: React.FC<{ children: React.ReactNode; showNewUser?: React.ReactNode }> = ({
  children,
  showNewUser,
}) => {
  const { language } = useI18n();
  const isZh = language === "zh-CN";

  return (
    <div className="bg-white amz-auth">
      {/* 顶部 Logo */}
      <div className="pt-[18px] pb-[12px] flex justify-center">
        <BrandLogo />
      </div>

      {/* 主内容 */}
      <div className="flex flex-col items-center w-full px-4 animate-fade-in">
        {children}
        {showNewUser ? <div className="mt-[14px] w-full flex justify-center">{showNewUser}</div> : null}
      </div>

      {/* Footer 上方横线 */}
      <div className="mt-[28px]">
        <div className="h-[1px] bg-[#DDD] w-full" />
      </div>

      {/* Footer 链接 */}
      <div className="pt-[22px]">
        <div className="footer-links flex justify-center gap-10 text-[12px] mb-3 font-medium">
          <a href="#" className="amz-link">
            {isZh ? "使用条件" : "Conditions of Use"}
          </a>
          <a href="#" className="amz-link">
            {isZh ? "隐私声明" : "Privacy Notice"}
          </a>
          <a href="#" className="amz-link">
            {isZh ? "帮助" : "Help"}
          </a>
        </div>

        <div className="text-center text-[12px] text-[#565959]">
          © 1996-2025, Amazon.com, Inc. {isZh ? "或其附属公司" : "or its affiliates"}
        </div>
      </div>

      {/* 真实页底部会留很多空白 */}
      <div className="h-[220px]" />
    </div>
  );
};

export default AuthLayout;
