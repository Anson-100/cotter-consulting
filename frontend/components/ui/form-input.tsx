import { forwardRef, InputHTMLAttributes, ReactNode } from "react"

type Variant = "default" | "signature"

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  rightElement?: ReactNode
  variant?: Variant
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  function FormInput(
    {
      label,
      error,
      className = "",
      rightElement,
      variant = "default",
      ...props
    },
    ref,
  ) {
    // ── Signature variant: dotted underline, label below ──────────
    if (variant === "signature") {
      return (
        <div className="w-full">
          <div className="relative">
            <input
              ref={ref}
              {...props}
              className={`
                block w-full
                bg-transparent
                px-0 py-1.5 text-base
                text-zinc-800 dark:text-gray-200
                placeholder:text-gray-400 dark:placeholder:text-gray-500
                border-b-2 border-dotted border-zinc-300 dark:border-zinc-600
                focus:border-indigo-500 dark:focus:border-indigo-400
                outline-none
                ${className}
              `}
            />
            {rightElement && (
              <div className="absolute inset-y-0 right-2 flex items-center">
                {rightElement}
              </div>
            )}
          </div>
          {label && (
            <span className="block mt-1 text-gray-500 dark:text-gray-400 tracking-wide">
              {label}
            </span>
          )}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      )
    }

    // ── Default variant: original boxed input ─────────────────────
    // ── Default variant: boxed input with focus accent ───────────
    // ── Default variant: boxed input with focus accent ───────────
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block font-semibold text-gray-600 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <div className="mt-2 relative group">
          <input
            ref={ref}
            {...props}
            className={`
          block w-full rounded
          bg-white dark:bg-zinc-950
          px-3.5 py-2.5 text-base text-zinc-800 dark:text-gray-200
          outline-1 -outline-offset-1 outline-zinc-200 dark:outline-zinc-700
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-1 focus:outline-succulent overflow-hidden
          ${className}
        `}
          />

          {/* Left accent bar — inset to align with outline */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-px top-px bottom-px w-1  bg-succulent opacity-0 transition-opacity duration-200 group-focus-within:opacity-100"
          />

          {rightElement && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              {rightElement}
            </div>
          )}

          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    )
  },
)

export default FormInput
