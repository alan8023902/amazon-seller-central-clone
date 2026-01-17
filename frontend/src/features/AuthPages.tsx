import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useStore } from "../store";
import { Button, InputField, Card } from "../components/UI";
import AuthLayout from "../layouts/AuthLayout";
import { useI18n } from "../hooks/useI18n";

export const LoginEmail = () => {
  const navigate = useNavigate();
  const setSession = useStore((state) => state.setSession);
  const { t } = useI18n();

  // 移到组件内部以便访问 t 函数
  const emailSchema = z.object({
    email: z.string().min(1, t("emailRequired")),
  });

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = (data: any) => {
    setSession({ email: data.email, step: "password" });
    navigate("/auth/login-password");
  };

  const newUserSection = (
    <div className="w-[350px]">
      {/* 这里不再加“大分割线”，只保留 divider 文案样式 */}
      <div className="amz-divider-text">{t("newCustomer")}</div>
      <Button variant="white" onClick={() => navigate("/auth/register")}>
        {t("createAccount")}
      </Button>
    </div>
  );

  return (
    <AuthLayout showNewUser={newUserSection}>
      <Card>
        <h1 className="text-[20px] font-normal mb-[14px] leading-[36px] text-[#0F1111]">
          {t("login")}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label={t("emailAddress")}
            placeholder={t("emailAddress")}
            {...register("email")}
            error={errors.email?.message as string}
            autoComplete="username"
            className="amz-auth-field"
          />
          <Button type="submit" className="mt-[10px]">
            {t("continue")}
          </Button>
        </form>

        {/* 条款行与按钮间距 */}
        <div className="text-[12px] mt-[14px] text-[#0F1111] leading-[18px]">
          {t('continueAgree')}
          <a href="#" className="amz-link">
            {t('termsCondition')}
          </a>
          {t('and')}
          <a href="#" className="amz-link">
            {t('privacyNotice')}
          </a>
          。
        </div>

        <div className="mt-[30px]">
          <Button variant="white" onClick={() => navigate(-1)}>
            {t("cancel")}
          </Button>
        </div>

        <div className="mt-[12px] flex items-center gap-[10px] cursor-pointer group w-fit">
          <span className="text-[13px] amz-link group-hover:underline">
            {t("needHelp")}
          </span>
          <ChevronDown size={16} className="text-[#565959]" />
        </div>
      </Card>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-[28px] font-normal mb-[14px] leading-[36px] text-[#0F1111]">
          {t("registerTitle")}
        </h1>

        <div className="space-y-4">
          <InputField label={t("yourName")} placeholder={t("yourName")} autoComplete="name" className="amz-auth-field" />
          <InputField label={t("emailAddress")} placeholder={t("emailAddress")} autoComplete="email" className="amz-auth-field" />
          <InputField
            label={t("password")}
            type="password"
            placeholder={t("passwordAtLeast")}
            autoComplete="new-password"
            helper={t("passwordHelper")}
            helperIcon={
              <div className="w-[16px] h-[16px] bg-[#007185] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                i
              </div>
            }
            className="amz-auth-field"
          />
          <InputField label={t("passwordAgain")} type="password" placeholder={t("passwordAgain")} autoComplete="new-password" className="amz-auth-field" />
          <Button className="mt-[50px]">
            {t("createAccount")}
          </Button>
        </div>

        <div className="text-[12px] mt-[12px] text-[#0F1111] leading-[28px]">
          {t('createAgree')}
          <a href="#" className="amz-link">
            {t('termsCondition')}
          </a>
          {t('and')}
          <a href="#" className="amz-link">
            {t('privacyNotice')}
          </a>
          。
        </div>

        <div className="h-[2px] bg-[#E7E9EC] w-full my-[14px]" />

        <div className="text-[13px] text-[#0F1111]">
          {t("alreadyHaveAccount")} {
            " "
          }
          <a onClick={() => navigate("/auth/login-email")} className="amz-link font-bold">
            {t("login")} <ChevronRight size={14} className="inline ml-[-2px]" />
          </a>
        </div>
      </Card>
    </AuthLayout>
  );
};

export const LoginPassword = () => {
  const navigate = useNavigate();
  const session = useStore((state) => state.session);
  const { t } = useI18n();

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-[24px] font-medium mb-[12px] text-[#0F1111]">{t("login")}</h1>

        <div className="text-[13px] mb-[10px] flex items-center">
          <span className="text-[#0F1111] font-bold">{session.email}</span>
          <button onClick={() => navigate("/auth/login-email")} className="amz-link text-[12px] ml-[8px]">
            {t('change')}
          </button>
        </div>

        <div className="mb-[10px]">
          <div className="flex justify-between mb-[4px]">
            <label className="text-[13px] font-bold text-[#0F1111]">{t("password")}</label>
            <a href="#" className="amz-link text-[12px]">
              {t("forgotPassword")}
            </a>
          </div>
          <input
            type="password"
            className="amz-input-base amz-input-focus"
            defaultValue="admin123"
            autoComplete="current-password"
            placeholder={t("password")}
          />
        </div>

        <Button onClick={() => navigate("/auth/login-otp")} className="mt-[6px]">
          {t("login")}
        </Button>

        <div className="mt-[12px]">
          <label className="flex items-center gap-[8px] text-[13px] cursor-pointer">
            <input type="checkbox" className="w-[14px] h-[14px] border-[#A6A6A6] rounded-[2px]" />
            <span>{t("rememberMe")}</span>
          </label>
        </div>

        <div className="h-[1px] bg-[#E7E9EC] w-full my-[14px]" />

        <Button variant="white" onClick={() => navigate("/auth/register")}>
          {t("createAccount")}
        </Button>
      </Card>
    </AuthLayout>
  );
};

export const LoginOTP = () => {
  const navigate = useNavigate();
  const setSession = useStore((state) => state.setSession);
  const { t } = useI18n();

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-[24px] font-medium mb-[12px] text-[#0F1111]">{t("login")}</h1>

        <div className="text-[13px] mb-[10px] text-[#0F1111] leading-[18px]">
          {t("otpDesc")}
        </div>

        <InputField label={t('enterVerificationCode')} placeholder={t('enterVerificationCode')} />

        <div className="flex items-center gap-[8px] mb-[12px]">
          <input type="checkbox" id="no-otp" className="w-[14px] h-[14px]" />
          <label htmlFor="no-otp" className="text-[13px]">
            {t("noOtp")}
          </label>
        </div>

        <Button
          onClick={() => {
            setSession({ isLoggedIn: true });
            navigate("/app/dashboard");
          }}
        >
          {t("login")}
        </Button>

        <div className="mt-[14px] border-t border-[#E7E9EC] pt-[10px]">
          <a href="#" className="amz-link text-[13px]">
            {t("notReceivedOtp")}
          </a>
        </div>
      </Card>
    </AuthLayout>
  );
};
