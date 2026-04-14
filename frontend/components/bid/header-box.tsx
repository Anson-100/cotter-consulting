"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { HeaderBlock } from "@/lib/validations/bid"
import {
  CubeIcon,
  PhoneIcon,
  EnvelopeIcon,
  PhotoIcon,
  TrashIcon,
} from "@heroicons/react/24/outline"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"

interface HeaderBoxProps {
  block: HeaderBlock

  bidId?: string
  readOnly?: boolean
  onUpdate?: (updatedBlock: HeaderBlock) => void
}

export default function HeaderBox({
  block,
  bidId,
  readOnly = false,
  onUpdate,
}: HeaderBoxProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editedCompanyName, setEditedCompanyName] = useState(block.companyName)
  const [editedTagline, setEditedTagline] = useState(block.tagline || "")
  const [editedPhone, setEditedPhone] = useState(block.phone || "")
  const [editedEmail, setEditedEmail] = useState(block.email || "")
  const [editedLogoUrl, setEditedLogoUrl] = useState(block.logoUrl || "")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleLogoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user || !bidId) return

    setIsUploading(true)
    setUploadError(null)

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image")
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Logo must be under 2MB")
      }

      const ext = file.name.split(".").pop()
      const filename = `logo-${Date.now()}.${ext}`
      const path = `${user.id}/${bidId}/${filename}`

      if (editedLogoUrl) {
        try {
          const url = new URL(editedLogoUrl)
          const pathMatch = url.pathname.match(/bid-photos\/(.+)$/)
          if (pathMatch) {
            await supabase.storage.from("bid-photos").remove([pathMatch[1]])
          }
        } catch {
          // Continue even if delete fails
        }
      }

      const { error: uploadError } = await supabase.storage
        .from("bid-photos")
        .upload(path, file)

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      const { data: urlData } = supabase.storage
        .from("bid-photos")
        .getPublicUrl(path)

      setEditedLogoUrl(urlData.publicUrl)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveLogo = async () => {
    if (editedLogoUrl) {
      try {
        const url = new URL(editedLogoUrl)
        const pathMatch = url.pathname.match(/bid-photos\/(.+)$/)
        if (pathMatch) {
          await supabase.storage.from("bid-photos").remove([pathMatch[1]])
        }
      } catch {
        // Continue even if delete fails
      }
    }
    setEditedLogoUrl("")
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const limited = numbers.slice(0, 10)

    if (limited.length <= 3) return limited
    if (limited.length <= 6)
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        companyName: editedCompanyName,
        tagline: editedTagline || undefined,
        logoUrl: editedLogoUrl || undefined,
        phone: editedPhone || undefined,
        email: editedEmail || undefined,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedCompanyName(block.companyName)
    setEditedTagline(block.tagline || "")
    setEditedPhone(block.phone || "")
    setEditedEmail(block.email || "")
    setEditedLogoUrl(block.logoUrl || "")
    setUploadError(null)
    setIsEditing(false)
  }

  const formatPhoneLink = (phone: string) => phone.replace(/\D/g, "")

  // Padding class to prevent content overlapping toolbar
  const contentPadding = !readOnly ? "pr-16" : ""

  return (
    <BlockShell
      variant="header"
      readOnly={readOnly}
      isEditing={isEditing}
      hasUnsavedChanges={
        editedCompanyName !== block.companyName ||
        editedTagline !== (block.tagline || "") ||
        editedPhone !== (block.phone || "") ||
        editedEmail !== (block.email || "") ||
        editedLogoUrl !== (block.logoUrl || "")
      }
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between w-full lg:max-w-7xl mx-auto gap-4 ${contentPadding}`}
      >
        {/* Left side: Logo + Company Info */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          {isEditing ? (
            <div className="relative">
              {editedLogoUrl ? (
                <div className="relative group">
                  <Image
                    src={editedLogoUrl}
                    alt="Company logo"
                    width={48}
                    height={48}
                    className="size-14 rounded-md object-cover ring-1 ring-black/10 dark:ring-white/10"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-1 -right-1 p-1 rounded-full bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon className="size-3 text-white" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="size-12 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 dark:hover:border-indigo-500 flex items-center justify-center disabled:opacity-50"
                >
                  {isUploading ? (
                    <div className="size-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <PhotoIcon className="size-6 text-zinc-400" />
                  )}
                </button>
              )}
            </div>
          ) : block.logoUrl ? (
            <Image
              src={block.logoUrl}
              alt="Company logo"
              width={56}
              height={56}
              className="size-14 rounded-md object-cover ring-1 ring-black/10 dark:ring-white/10"
            />
          ) : (
            <CubeIcon className="size-6 text-indigo-600 dark:text-indigo-500" />
          )}

          {/* Company Name & Tagline */}
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <EditorField
                value={editedCompanyName}
                onChange={(e) => setEditedCompanyName(e.target.value)}
                placeholder="Company name"
                className="text-xl font-bold"
              />
              <EditorField
                value={editedTagline}
                onChange={(e) => setEditedTagline(e.target.value)}
                placeholder="Tagline (optional)"
                className="text-base text-gray-600 dark:text-gray-400"
              />
            </div>
          ) : (
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {block.companyName}
              </h1>
              {block.tagline && (
                <span className="text-base text-gray-600 dark:text-gray-300">
                  {block.tagline}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right side: Contact Info */}
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-5 text-zinc-400 shrink-0" />
              <EditorField
                value={editedPhone}
                onChange={(e) =>
                  setEditedPhone(formatPhoneNumber(e.target.value))
                }
                placeholder="Phone number"
                className="text-base"
              />
            </div>
            <div className="flex items-center gap-2">
              <EnvelopeIcon className="size-5 text-zinc-400 shrink-0" />
              <EditorField
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="Email address"
                type="email"
                className="text-base"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-gray-600 dark:text-gray-300">
            {block.phone && (
              <a
                href={`tel:${formatPhoneLink(block.phone)}`}
                className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <PhoneIcon className="size-5" />
                <span className="text-base font-medium">{block.phone}</span>
              </a>
            )}
            {block.email && (
              <a
                href={`mailto:${block.email}`}
                className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <EnvelopeIcon className="size-5" />
                <span className="text-base font-medium">{block.email}</span>
              </a>
            )}
          </div>
        )}
      </div>

      {/* Upload Error */}
      {uploadError && (
        <p className="mt-2 text-base text-red-500 text-center">{uploadError}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleLogoSelect}
        className="hidden"
      />
    </BlockShell>
  )
}
