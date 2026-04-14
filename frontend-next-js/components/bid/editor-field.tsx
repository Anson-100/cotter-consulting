"use client"

import {
  forwardRef,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  ReactNode,
  FocusEvent,
} from "react"
import { twMerge } from "tailwind-merge"

type BaseProps = {
  label?: string
  error?: string
  rightElement?: ReactNode
  className?: string
  /** When true, all text is selected on focus (like OS file rename). Defaults to true. */
  selectOnFocus?: boolean
}

type InputProps = BaseProps & {
  as?: "input"
  rows?: never
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">

type TextareaProps = BaseProps & {
  as: "textarea"
  rows?: number
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">

type EditorFieldProps = InputProps | TextareaProps

const sharedStyles = `
  block w-full
  px-2 py-1 text-base
  text-zinc-800 dark:text-gray-200
  placeholder:text-gray-400 dark:placeholder:text-gray-500
  border-none outline-none
  rounded
  bg-zinc-100 dark:bg-zinc-800
  hover:bg-zinc-200 dark:hover:bg-zinc-700
  focus:bg-sky-100 dark:focus:bg-sky-950
  transition-colors duration-100
`

const EditorField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  EditorFieldProps
>(function EditorField(props, ref) {
  const {
    label,
    error,
    className = "",
    rightElement,
    as = "input",
    selectOnFocus = true,
    ...rest
  } = props

  const handleFocus = (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (selectOnFocus && e.target.value) {
      e.target.select()
    }
    // Call the original onFocus if provided
    if (as === "textarea") {
      ;(rest as TextareaHTMLAttributes<HTMLTextAreaElement>).onFocus?.(
        e as FocusEvent<HTMLTextAreaElement>,
      )
    } else {
      ;(rest as InputHTMLAttributes<HTMLInputElement>).onFocus?.(
        e as FocusEvent<HTMLInputElement>,
      )
    }
  }

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={rest.id}
          className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {as === "textarea" ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            rows={(props as TextareaProps).rows ?? 2}
            className={twMerge(sharedStyles, "resize-none", className)}
            onFocus={
              handleFocus as (e: FocusEvent<HTMLTextAreaElement>) => void
            }
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
            className={twMerge(sharedStyles, className)}
            onFocus={handleFocus as (e: FocusEvent<HTMLInputElement>) => void}
          />
        )}
        {rightElement && (
          <div className="absolute inset-y-0 right-2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
})

export default EditorField
