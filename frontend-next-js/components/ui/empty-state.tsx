// components/ui/empty-state.tsx

import { ReactNode } from "react"
import Button from "@/components/ui/button"
import { PlusIcon } from "@heroicons/react/24/outline"

type EmptyStateProps = {
  icon: ReactNode
  title: string
  subtitle: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto size-12 text-gray-400 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
        {title}
      </h3>
      <p className="mt-1 text-gray-600 dark:text-gray-400">{subtitle}</p>
      {action && (
        <div className="mt-6">
          <Button
            as="button"
            variant="primary"
            size="md"
            onClick={action.onClick}
          >
            {action.icon || <PlusIcon className="size-5 mr-1" />}
            {action.label}
          </Button>
        </div>
      )}
    </div>
  )
}
