"use client"

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  description?: string
  id?: string
  disabled?: boolean
}

export default function Checkbox({
  checked,
  onChange,
  label,
  description,
  id,
  disabled = false,
}: CheckboxProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || "checkbox"

  return (
    <div className="flex gap-3">
      <div className="flex h-6 shrink-0 items-center">
        <div className="group grid size-5 grid-cols-1">
          <input
            id={inputId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="col-start-1 row-start-1 appearance-none rounded-sm border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="pointer-events-none col-start-1 row-start-1 size-5 self-center justify-self-center stroke-white opacity-0 group-has-checked:opacity-100 transition"
          >
            <path
              d="M5 10l3 3 7-7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {(label || description) && (
        <div>
          {label && (
            <label
              htmlFor={inputId}
              className="font-medium text-gray-800 dark:text-gray-200 cursor-pointer"
            >
              {label}
            </label>
          )}
          {description && (
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
    </div>
  )
}
