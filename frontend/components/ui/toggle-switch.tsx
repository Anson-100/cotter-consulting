"use client"

interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  ariaLabel?: string
  disabled?: boolean
}

export default function ToggleSwitch({
  checked,
  onChange,
  label,
  ariaLabel,
  disabled = false,
}: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`group relative inline-flex w-11 shrink-0 rounded-full p-0.5 outline-offset-2 outline-indigo-500 transition-colors duration-200 ease-in-out ${
          checked
            ? "bg-indigo-500"
            : "bg-zinc-200 dark:bg-white/5 ring-1 ring-inset ring-zinc-300 dark:ring-white/10"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          aria-label={ariaLabel || label || "Toggle"}
          className="absolute inset-0 size-full cursor-pointer appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full disabled:cursor-not-allowed"
        />
      </div>
      {label && (
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
    </div>
  )
}
