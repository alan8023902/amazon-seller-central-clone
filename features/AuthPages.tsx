import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useStore } from "../store";
import { Button, InputField, Card } from "../components/UI";
import AuthLayout from "../layouts/AuthLayout";

const emailSchema = z.object({
  email: z.string().min(1, "请输入您的电子邮箱或手机号码"),
});

export const LoginEmail = () => {
  const navigate = useNavigate();
  const setSession = useStore((state) => state.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      <div className="amz-divider-text">亚马逊新客户？</div>
      <Button variant="white" onClick={() => navigate("/auth/register")}>
        创建您的亚马逊账户
      </Button>
    </div>
  );

  return (
    <AuthLayout showNewUser={newUserSection}>
      <Card>
        <h1 className="text-[28px] font-normal mb-[14px] leading-[36px] text-[#0F1111]">
          登录
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="输入手机号码或邮箱"
            {...register("email")}
            error={errors.email?.message as string}
            autoComplete="username"
            className="amz-auth-field"
          />
          <Button type="submit" className="mt-[10px]">
            继续
          </Button>
        </form>

        {/* 条款行与按钮间距 */}
        <div className="text-[12px] mt-[10px] text-[#0F1111] leading-[18px]">
          继续操作即表示您同意亚马逊的{" "}
          <a href="#" className="amz-link">
            使用条件
          </a>{" "}
          和{" "}
          <a href="#" className="amz-link">
            隐私声明
          </a>
          。
        </div>

        <div className="mt-[14px]">
          <Button variant="white" onClick={() => navigate(-1)}>
            取消
          </Button>
        </div>

        <div className="mt-[8px] flex items-center gap-[6px] cursor-pointer group w-fit">
          <span className="text-[13px] amz-link group-hover:underline">
            需要帮助?
          </span>
          <ChevronDown size={16} className="text-[#565959]" />
        </div>
      </Card>
    </AuthLayout>
  );
};

export const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-[28px] font-normal mb-[14px] leading-[36px] text-[#0F1111]">
          创建帐户
        </h1>

        <div className="space-y-0">
          <InputField label="您的姓名" placeholder="姓名" autoComplete="name" className="amz-auth-field" />
          <InputField label="邮箱地址" autoComplete="email" className="amz-auth-field" />
          <InputField
            label="密码"
            type="password"
            placeholder="至少 6 个字符"
            autoComplete="new-password"
            helper="密码必须至少为 6 个字符。"
            helperIcon={
              <div className="w-[16px] h-[16px] bg-[#007185] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                i
              </div>
            }
            className="amz-auth-field"
          />
          <InputField label="再次输入密码" type="password" autoComplete="new-password" className="amz-auth-field" />
          <Button className="mt-[6px]">创建您的亚马逊账户</Button>
        </div>

        <div className="text-[12px] mt-[12px] text-[#0F1111] leading-[18px]">
          创建帐户，即表示您同意遵守 Amazon 的{" "}
          <a href="#" className="amz-link">
            使用条件
          </a>{" "}
          和{" "}
          <a href="#" className="amz-link">
            隐私声明
          </a>
          。
        </div>

        <div className="h-[1px] bg-[#E7E9EC] w-full my-[14px]" />

        <div className="text-[13px] text-[#0F1111]">
          已拥有帐户？{" "}
          <a onClick={() => navigate("/auth/login-email")} className="amz-link font-bold">
            登录 <ChevronRight size={14} className="inline ml-[-2px]" />
          </a>
        </div>
      </Card>
    </AuthLayout>
  );
};

export const LoginPassword = () => {
  const navigate = useNavigate();
  const session = useStore((state) => state.session);

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-[24px] font-medium mb-[12px] text-[#0F1111]">登录</h1>

        <div className="text-[13px] mb-[10px] flex items-center">
          <span className="text-[#0F1111] font-bold">{session.email}</span>
          <button onClick={() => navigate("/auth/login-email")} className="amz-link text-[12px] ml-[8px]">
            更改
          </button>
        </div>

        <div className="mb-[10px]">
          <div className="flex justify-between mb-[4px]">
            <label className="text-[13px] font-bold text-[#0F1111]">密码</label>
            <a href="#" className="amz-link text-[12px]">
              忘记密码
            </a>
          </div>
          <input
            type="password"
            className="amz-input-base amz-input-focus"
            defaultValue="admin123"
            autoComplete="current-password"
          />
        </div>

        <Button onClick={() => navigate("/auth/login-otp")} className="mt-[6px]">
          登录
        </Button>

        <div className="mt-[12px]">
          <label className="flex items-center gap-[8px] text-[13px] cursor-pointer">
            <input type="checkbox" className="w-[14px] h-[14px] border-[#A6A6A6] rounded-[2px]" />
            <span>保持登录状态</span>
          </label>
        </div>

        <div className="h-[1px] bg-[#E7E9EC] w-full my-[14px]" />

        <Button variant="white" onClick={() => navigate("/auth/register")}>
          立即注册
        </Button>
      </Card>
    </AuthLayout>
  );
};

export const LoginOTP = () => {
  const navigate = useNavigate();
  const setSession = useStore((state) => state.setSession);

  return (
    <AuthLayout>
      <Card>
        <h1 className="text-[24px] font-medium mb-[8px] text-[#0F1111]">两步验证</h1>
        <p className="text-[13px] mb-[10px] text-[#0F1111] leading-[18px]">
          为了提高安全性，请输入验证码。
        </p>

        <InputField label="输入验证码：" />

        <div className="flex items-center gap-[8px] mb-[12px]">
          <input type="checkbox" id="no-otp" className="w-[14px] h-[14px]" />
          <label htmlFor="no-otp" className="text-[13px]">
            此浏览器无需验证码
          </label>
        </div>

        <Button
          onClick={() => {
            setSession({ isLoggedIn: true });
            navigate("/app/dashboard");
          }}
        >
          登录
        </Button>

        <div className="mt-[14px] border-t border-[#E7E9EC] pt-[10px]">
          <a href="#" className="amz-link text-[13px]">
            是否未收到验证码？
          </a>
        </div>
      </Card>
    </AuthLayout>
  );
};
