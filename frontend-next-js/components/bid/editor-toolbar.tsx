"use client"

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react"
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/solid"
import {
  DocumentTextIcon,
  DocumentArrowDownIcon,
  MapPinIcon,
  PhotoIcon,
  ListBulletIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PaperAirplaneIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline"
import { cn } from "@/lib/utils"
import type { BidBlock } from "@/lib/validations/bid"
import GhostButton from "@/components/ui/ghost-button"
import PdfDownloadButton from "@/components/bid/pdf-download-button"

// Default block data for each type
function getDefaultBlock(type: string): BidBlock | null {
  switch (type) {
    case "greeting":
      return {
        type: "greeting",
        jobName: "Your job title here",
      }
    case "content":
      return {
        type: "content",
        header: "New section",
        icon: "InformationCircleIcon",
        items: [{ title: "Item title", content: "Item description" }],
      }
    case "location":
      return {
        type: "location",
        header: "Location",
        address: "",
      }
    case "photo":
      return {
        type: "photo",
        header: "Photos",
        isBeforeAfter: false,
        photos: [],
        beforePhotos: [],
        afterPhotos: [],
      }
    case "stepTracker":
      return {
        type: "stepTracker",
        header: "Scope of work",
        subtitle: "Click each step to view details",
        steps: [
          {
            id: "1",
            name: "Step 1",
            description: "Description",
            status: "upcoming",
          },
          {
            id: "2",
            name: "Step 2",
            description: "Description",
            status: "upcoming",
          },
        ],
      }
    case "pricing":
      return {
        type: "pricing",
        header: "Pricing",
        showLineItems: true,
        lineItems: [
          { id: "1", description: "Labor", amount: 0 },
          { id: "2", description: "Materials", amount: 0 },
        ],
        showBillableHours: false,
        hourlyRate: 0,
        hourEntries: [],
        depositPercent: 50,
        paymentTerms: "",
        showBreakdownToCustomer: false,
        notes: [],
      }
    case "signature":
      return {
        type: "signature",
        header: "Authorization",
        bodyText:
          "By signing below, I authorize the work described in this estimate and agree to the terms outlined above.",
        signers: [
          { id: "1", label: "Contractor" },
          { id: "2", label: "Customer" },
        ],
      }
    default:
      return null
  }
}

interface EditorToolbarProps {
  bidId?: string
  blocks?: BidBlock[]
  onAddBlock: (block: BidBlock) => void
  onPreview?: () => void
  onSend?: () => void
  isMobileView?: boolean
  onToggleMobileView?: () => void
}

export default function EditorToolbar({
  bidId,
  blocks,
  onAddBlock,
  onPreview,
  onSend,
  isMobileView,
  onToggleMobileView,
}: EditorToolbarProps) {
  const handleAddBlock = (type: string) => {
    const block = getDefaultBlock(type)
    if (block) {
      onAddBlock(block)
    }
  }

  const blockOptions = [
    {
      label: "Greeting",
      icon: ChatBubbleBottomCenterTextIcon,
      type: "greeting",
    },
    {
      label: "Content block",
      icon: DocumentTextIcon,
      type: "content",
    },
    {
      label: "Location block",
      icon: MapPinIcon,
      type: "location",
    },
    {
      label: "Photo block",
      icon: PhotoIcon,
      type: "photo",
    },
    {
      label: "Pricing block",
      icon: CurrencyDollarIcon,
      type: "pricing",
    },
    {
      label: "Step tracker",
      icon: ListBulletIcon,
      type: "stepTracker",
    },
    {
      label: "Signature block",
      icon: PencilSquareIcon,
      type: "signature",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-zinc-950 border-t-2 border-zinc-200 dark:border-zinc-800">
      <div className="w-11/12 lg:max-w-7xl mx-auto py-3">
        <div className="flex items-center justify-end gap-2">
          {/* === DESKTOP: Show all buttons (sm+) === */}

          {/* Mobile view toggle - only show on lg+ */}
          {onToggleMobileView && (
            <GhostButton
              onClick={onToggleMobileView}
              className={cn(
                "hidden lg:flex",
                isMobileView &&
                  "text-indigo-600 dark:text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50",
              )}
            >
              {isMobileView ? (
                <>
                  <ComputerDesktopIcon className="size-5" />
                  <span>Desktop</span>
                </>
              ) : (
                <>
                  <DevicePhoneMobileIcon className="size-5" />
                  <span>Mobile</span>
                </>
              )}
            </GhostButton>
          )}

          {/* Preview - hidden on mobile */}
          {bidId && onPreview && (
            <GhostButton onClick={onPreview} className="hidden sm:flex">
              <EyeIcon className="size-5" />
              <span>Preview</span>
            </GhostButton>
          )}

          {/* PDF Download - hidden on mobile */}
          {bidId && blocks && (
            <div className="hidden sm:block">
              <PdfDownloadButton
                blocks={blocks}
                filename={`estimate-${bidId}.pdf`}
              />
            </div>
          )}

          {/* View Live - hidden on mobile */}
          {bidId && (
            <GhostButton
              href={`/bid/${bidId}`}
              target="_blank"
              className="hidden sm:flex"
            >
              <ArrowTopRightOnSquareIcon className="size-5" />
              <span>View Live</span>
            </GhostButton>
          )}

          {/* === MOBILE: Menu dropdown (sm and below) === */}
          <Menu as="div" className="relative sm:hidden">
            <MenuButton className="flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <span>Menu</span>
              <ChevronDownIcon className="size-4" />
            </MenuButton>

            <MenuItems
              className={cn(
                "absolute left-0 bottom-full mb-2 rounded-lg py-2",
                "bg-white dark:bg-zinc-950 shadow-lg",
                "ring-2 ring-zinc-200 dark:ring-zinc-800",
                "focus:outline-none",
                "min-w-[180px]",
              )}
            >
              {bidId && onPreview && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={onPreview}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 text-left",
                        "text-gray-600 dark:text-gray-300",
                        focus &&
                          "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-500",
                      )}
                    >
                      <EyeIcon
                        className={cn(
                          "size-5",
                          focus
                            ? "text-indigo-600 dark:text-indigo-500"
                            : "text-gray-400",
                        )}
                      />
                      <span className="font-semibold">Preview</span>
                    </button>
                  )}
                </MenuItem>
              )}

              {bidId && (
                <MenuItem>
                  {({ focus }) => (
                    <a
                      href={`/bid/${bidId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 text-left",
                        "text-gray-600 dark:text-gray-300",
                        focus &&
                          "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-500",
                      )}
                    >
                      <ArrowTopRightOnSquareIcon
                        className={cn(
                          "size-5",
                          focus
                            ? "text-indigo-600 dark:text-indigo-500"
                            : "text-gray-400",
                        )}
                      />
                      <span className="font-semibold">View Live</span>
                    </a>
                  )}
                </MenuItem>
              )}

              {bidId && blocks && (
                <MenuItem>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => {
                        import("@/lib/pdf").then(({ downloadBidPdf }) => {
                          downloadBidPdf(blocks, `estimate-${bidId}.pdf`)
                        })
                      }}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 text-left",
                        "text-gray-600 dark:text-gray-300",
                        focus &&
                          "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-500",
                      )}
                    >
                      <DocumentArrowDownIcon
                        className={cn(
                          "size-5",
                          focus
                            ? "text-indigo-600 dark:text-indigo-500"
                            : "text-gray-400",
                        )}
                      />
                      <span className="font-semibold">Download PDF</span>
                    </button>
                  )}
                </MenuItem>
              )}
            </MenuItems>
          </Menu>

          {/* Send - always visible */}
          {bidId && onSend && (
            <GhostButton onClick={onSend}>
              <PaperAirplaneIcon className="size-5" />
              <span>Send</span>
            </GhostButton>
          )}

          {/* Add block menu - always visible */}
          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-2 px-4 py-2.5 rounded-md font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <PlusIcon className="size-5 rounded-full p-0.5 ring-2 ring-indigo-600 text-white bg-indigo-500 dark:ring-indigo-500 dark:bg-indigo-600/90" />
              <span className="hidden sm:inline">Add block</span>
              <span className="sm:hidden">Add</span>
            </MenuButton>

            <MenuItems
              className={cn(
                "absolute right-0 bottom-full mb-2 rounded-lg py-2",
                "bg-white dark:bg-zinc-950 shadow-lg",
                "ring-2 ring-zinc-200 dark:ring-zinc-800",
                "focus:outline-none",
                "min-w-[200px]",
              )}
            >
              {blockOptions.map((option) => (
                <MenuItem key={option.type}>
                  {({ focus }) => (
                    <button
                      type="button"
                      onClick={() => handleAddBlock(option.type)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 text-left",
                        "text-gray-600 dark:text-gray-300",
                        focus &&
                          "bg-zinc-100 dark:bg-zinc-800 text-indigo-600 dark:text-indigo-500",
                      )}
                    >
                      <option.icon
                        className={cn(
                          "size-5",
                          focus
                            ? "text-indigo-600 dark:text-indigo-500"
                            : "text-gray-400",
                        )}
                      />
                      <span className="font-semibold">{option.label}</span>
                    </button>
                  )}
                </MenuItem>
              ))}
            </MenuItems>
          </Menu>
        </div>
      </div>
    </div>
  )
}
