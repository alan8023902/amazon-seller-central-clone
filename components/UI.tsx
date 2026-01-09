import React from "react";

type CN = Array<string | undefined | null | false>;
const cn = (...args: CN) => args.filter(Boolean).join(" ");

/**
 * Auth 页用：amazon seller central（含橙色 smile）
 */
export const BrandLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center select-none", className)} aria-label="amazon seller central">
      <div className="relative">
        <div className="flex items-baseline justify-center gap-[4px]">
          <span className="text-[14px] font-bold text-black leading-none tracking-tight">amazon</span>
          <span className="text-[14px] font-semibold text-black leading-none tracking-tight">
            seller central
          </span>
        </div>

        {/* orange smile under "amazon" */}
        <svg className="absolute left-[10px] top-[16px]" width="54" height="9" viewBox="0 0 58 10" fill="none">
          <path
            d="M2 2.2C12 8.8 44 8.8 56 2.2"
            stroke="#FF9900"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M42.5 1.8L56 2.2L48.5 9"
            stroke="#FF9900"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

/**
 * App(控制台) Header 用：你项目里 MainLayout.tsx 在 import { ConsoleLogo }...
 * 这里补回同名导出，避免报错。
 * 如果你想换成更小的 logo，也可以只调 className。
 */
export const ConsoleLogo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={cn("flex items-center select-none", className)} aria-label="amazon seller central">
      <div className="relative">
        <div className="flex items-baseline gap-[6px]">
          <span className="text-[14px] font-bold text-white leading-none tracking-tight">amazon</span>
          <span className="text-[14px] font-semibold text-white leading-none tracking-tight">
            seller central
          </span>
        </div>

        {/* orange smile */}
        <svg className="absolute left-[10px] top-[16px]" width="52" height="9" viewBox="0 0 58 10" fill="none">
          <path
            d="M2 2.2C12 8.8 44 8.8 56 2.2"
            stroke="#FF9900"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
          <path
            d="M42.5 1.8L56 2.2L48.5 9"
            stroke="#FF9900"
            strokeWidth="2.1"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-white border border-[#D5D9D9] rounded-[8px] w-[350px] p-[20px] shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
};

type ButtonVariant = "yellow" | "white";

export const Button = ({
  children,
  className = "",
  variant = "yellow",
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) => {
  const base =
    "w-full h-[31px] text-[13px] font-medium rounded-full " +
    "flex items-center justify-center select-none " +
    "focus:outline-none focus:shadow-[0_0_0_3px_rgba(0,113,133,0.20)]";

  const styles: Record<ButtonVariant, string> = {
    yellow: "amz-btn-yellow",
    white: "amz-btn-white",
  };

  return (
    <button type={type} className={cn(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
};

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helper?: string;
  helperIcon?: React.ReactNode;
  inputClassName?: string;
};

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, helper, helperIcon, className = "", inputClassName = "", ...props }, ref) => {
    return (
      <div className={cn("mb-[12px]", className)}>
        {label ? (
          <label className="block text-[13px] font-bold mb-[4px] text-[#0F1111] leading-[16px]">
            {label}
          </label>
        ) : null}

        <input
          ref={ref}
          className={cn(
            "amz-input-base amz-input-focus",
            error ? "border-[#D00] shadow-[0_0_0_3px_rgba(221,0,0,0.10)]" : "",
            inputClassName
          )}
          {...props}
        />

        {helper ? (
          <div className="mt-[6px] flex items-start gap-[8px] text-[12px] text-[#0F1111] leading-[16px]">
            {helperIcon ? <div className="mt-[1px]">{helperIcon}</div> : null}
            <div>{helper}</div>
          </div>
        ) : null}

        {error ? (
          <div className="mt-[6px] text-[12px] text-[#D00] leading-[16px]">
            {error}
          </div>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
