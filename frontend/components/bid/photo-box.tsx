"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import type { PhotoBlock } from "@/lib/validations/bid"
import { PhotoIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid"
import EditorField from "@/components/bid/editor-field"
import BlockShell from "@/components/bid/block-shell"
import Lightbox from "@/components/bid/lightbox"

interface Photo {
  id: string
  url: string
  caption?: string
}

interface LightboxPhoto {
  id: string
  url: string
  caption?: string
  category?: "before" | "after"
  categoryIndex?: number
}

interface PhotoBoxProps {
  block: PhotoBlock
  bidId: string
  readOnly?: boolean
  onUpdate?: (updatedBlock: PhotoBlock) => void
  onDelete?: () => void
  // Move controls
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

type UploadTarget = "photos" | "before" | "after"

export default function PhotoBox({
  block,
  bidId,
  readOnly = false,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: PhotoBoxProps) {
  const { user } = useAuth()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editedHeader, setEditedHeader] = useState(block.header)
  const [editedIsBeforeAfter, setEditedIsBeforeAfter] = useState(
    block.isBeforeAfter ?? false,
  )
  const [editedPhotos, setEditedPhotos] = useState(block.photos)
  const [editedBeforePhotos, setEditedBeforePhotos] = useState(
    block.beforePhotos ?? [],
  )
  const [editedAfterPhotos, setEditedAfterPhotos] = useState(
    block.afterPhotos ?? [],
  )
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadTarget, setUploadTarget] = useState<UploadTarget>("photos")

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxPhotos, setLightboxPhotos] = useState<LightboxPhoto[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  // Detect sidebar state - undefined means no sidebar (customer view)
  const [sidebarPinned, setSidebarPinned] = useState<boolean | undefined>(
    undefined,
  )

  useEffect(() => {
    setMounted(true)

    if (typeof window !== "undefined") {
      // Check if we're actually in a dashboard route
      const isDashboard = window.location.pathname.startsWith("/dashboard")

      if (isDashboard) {
        // We're in dashboard - use sidebar state
        const stored = localStorage.getItem("sidebarPinned")
        setSidebarPinned(stored === "true")

        // Listen for sidebar changes
        const handleSidebarChange = (e: CustomEvent<boolean>) => {
          setSidebarPinned(e.detail)
        }
        window.addEventListener(
          "sidebarPinnedChange",
          handleSidebarChange as EventListener,
        )
        return () =>
          window.removeEventListener(
            "sidebarPinnedChange",
            handleSidebarChange as EventListener,
          )
      }
      // Not in dashboard - leave undefined (no sidebar)
    }
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !user) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not an image`)
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} exceeds 5MB limit`)
        }

        // Generate unique filename
        const ext = file.name.split(".").pop()
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.${ext}`
        const path = `${user.id}/${bidId}/${filename}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from("bid-photos")
          .upload(path, file)

        if (uploadError) {
          throw new Error(
            `Failed to upload ${file.name}: ${uploadError.message}`,
          )
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from("bid-photos")
          .getPublicUrl(path)

        return {
          id: filename,
          url: urlData.publicUrl,
          caption: "",
        }
      })

      const newPhotos = await Promise.all(uploadPromises)

      // Add to appropriate array based on upload target
      if (uploadTarget === "before") {
        setEditedBeforePhotos((prev) => [...prev, ...newPhotos])
      } else if (uploadTarget === "after") {
        setEditedAfterPhotos((prev) => [...prev, ...newPhotos])
      } else {
        setEditedPhotos((prev) => [...prev, ...newPhotos])
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerUpload = (target: UploadTarget) => {
    setUploadTarget(target)
    fileInputRef.current?.click()
  }

  const handleDeletePhoto = async (
    photoId: string,
    photoUrl: string,
    target: UploadTarget,
  ) => {
    // Extract path from URL for deletion
    try {
      const url = new URL(photoUrl)
      const pathMatch = url.pathname.match(/bid-photos\/(.+)$/)
      if (pathMatch) {
        const storagePath = pathMatch[1]
        await supabase.storage.from("bid-photos").remove([storagePath])
      }
    } catch {
      // Continue with local removal even if storage delete fails
      console.error("Failed to delete from storage")
    }

    if (target === "before") {
      setEditedBeforePhotos((prev) => prev.filter((p) => p.id !== photoId))
    } else if (target === "after") {
      setEditedAfterPhotos((prev) => prev.filter((p) => p.id !== photoId))
    } else {
      setEditedPhotos((prev) => prev.filter((p) => p.id !== photoId))
    }
  }

  const handleCaptionChange = (
    photoId: string,
    caption: string,
    target: UploadTarget,
  ) => {
    const updateCaption = (photos: Photo[]) =>
      photos.map((p) => (p.id === photoId ? { ...p, caption } : p))

    if (target === "before") {
      setEditedBeforePhotos(updateCaption)
    } else if (target === "after") {
      setEditedAfterPhotos(updateCaption)
    } else {
      setEditedPhotos(updateCaption)
    }
  }

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...block,
        header: editedHeader,
        isBeforeAfter: editedIsBeforeAfter,
        photos: editedPhotos,
        beforePhotos: editedBeforePhotos,
        afterPhotos: editedAfterPhotos,
      })
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedHeader(block.header)
    setEditedIsBeforeAfter(block.isBeforeAfter ?? false)
    setEditedPhotos(block.photos)
    setEditedBeforePhotos(block.beforePhotos ?? [])
    setEditedAfterPhotos(block.afterPhotos ?? [])
    setUploadError(null)
    setIsEditing(false)
  }

  const handlePhotoClick = (
    photos: Photo[],
    index: number,
    isBeforeAfterMode: boolean,
    target?: UploadTarget,
  ) => {
    // Only open lightbox in view mode
    if (!isEditing && photos.length > 0) {
      if (isBeforeAfterMode) {
        // Combine before and after photos with metadata
        const beforePhotos = (
          isEditing ? editedBeforePhotos : (block.beforePhotos ?? [])
        ).map((p, i) => ({
          ...p,
          category: "before" as const,
          categoryIndex: i + 1,
        }))

        const afterPhotos = (
          isEditing ? editedAfterPhotos : (block.afterPhotos ?? [])
        ).map((p, i) => ({
          ...p,
          category: "after" as const,
          categoryIndex: i + 1,
        }))

        const combined = [...beforePhotos, ...afterPhotos]

        // Calculate correct index in combined array
        let combinedIndex = 0
        if (target === "before") {
          combinedIndex = index
        } else if (target === "after") {
          combinedIndex = beforePhotos.length + index
        }

        setLightboxPhotos(combined)
        setLightboxIndex(combinedIndex)
      } else {
        // Regular mode - no category metadata
        setLightboxPhotos(photos)
        setLightboxIndex(index)
      }
      setLightboxOpen(true)
    }
  }

  // Reusable photo grid component
  const renderPhotoGrid = (
    photos: Photo[],
    target: UploadTarget,
    showUploadButton: boolean = true,
  ) => (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 sm:gap-x-6 2xl:grid-cols-4 xl:gap-x-8"
    >
      {photos.map((photo, index) => (
        <li key={photo.id} className="relative">
          <div
            className={`group overflow-hidden rounded bg-zinc-200 dark:bg-zinc-800 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 ${
              !isEditing ? "cursor-pointer" : ""
            }`}
            onClick={() =>
              !isEditing &&
              handlePhotoClick(
                photos,
                index,
                isEditing
                  ? editedIsBeforeAfter
                  : (block.isBeforeAfter ?? false),
                target,
              )
            }
          >
            <Image
              src={photo.url}
              alt={photo.caption || "Bid photo"}
              width={512}
              height={358}
              className="pointer-events-none aspect-10/7 w-full rounded object-cover ring-1 ring-inset ring-black/10 dark:ring-white/10 group-hover:opacity-75"
            />
            {!isEditing && (
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View {photo.caption || "photo"}</span>
              </button>
            )}
            {isEditing && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeletePhoto(photo.id, photo.url, target)
                }}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-red-600 hover:bg-red-700 opacity-0 group-hover:opacity-100"
              >
                <TrashIcon className="size-4 text-white" />
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="mt-2">
              <EditorField
                value={photo.caption || ""}
                onChange={(e) =>
                  handleCaptionChange(photo.id, e.target.value, target)
                }
                placeholder="Add caption..."
              />
            </div>
          ) : (
            photo.caption && (
              <p className="pointer-events-none mt-2 block truncate text-base font-medium text-gray-800 dark:text-gray-200">
                {photo.caption}
              </p>
            )
          )}
        </li>
      ))}

      {/* Upload Button (edit mode only) */}
      {isEditing && showUploadButton && (
        <li className="relative">
          <button
            type="button"
            onClick={() => triggerUpload(target)}
            disabled={isUploading}
            className="aspect-10/7 w-full rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading && uploadTarget === target ? (
              <div className="size-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusIcon className="size-8 text-zinc-400" />
                <span className="text-base text-zinc-500 font-medium">
                  Add photo
                </span>
              </>
            )}
          </button>
        </li>
      )}
    </ul>
  )

  // Get display photos for view mode
  const displayBeforePhotos = block.beforePhotos ?? []
  const displayAfterPhotos = block.afterPhotos ?? []
  const displayIsBeforeAfter = block.isBeforeAfter ?? false

  return (
    <>
      <BlockShell
        readOnly={readOnly}
        isEditing={isEditing}
        hasUnsavedChanges={
          editedHeader !== block.header ||
          editedIsBeforeAfter !== (block.isBeforeAfter ?? false) ||
          JSON.stringify(editedPhotos) !== JSON.stringify(block.photos) ||
          JSON.stringify(editedBeforePhotos) !==
            JSON.stringify(block.beforePhotos ?? []) ||
          JSON.stringify(editedAfterPhotos) !==
            JSON.stringify(block.afterPhotos ?? [])
        }
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
      >
        {/* Header */}
        {isEditing ? (
          <div className="mb-4 pr-20">
            <EditorField
              value={editedHeader}
              onChange={(e) => setEditedHeader(e.target.value)}
              placeholder="Section header"
              className="text-xl font-bold"
            />
          </div>
        ) : (
          <h3 className="text-xl text-gray-800 dark:text-gray-200 mb-4 font-bold pr-20">
            {block.header}
          </h3>
        )}

        {/* Before/After Toggle (edit mode only) */}
        {isEditing && (
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`group relative inline-flex w-11 shrink-0 rounded-full p-0.5 outline-offset-2 outline-indigo-500 transition-colors duration-200 ease-in-out ${
                editedIsBeforeAfter
                  ? "bg-indigo-500"
                  : "bg-zinc-200 dark:bg-white/5 ring-1 ring-inset ring-zinc-300 dark:ring-white/10"
              }`}
            >
              <span
                className={`size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out ${
                  editedIsBeforeAfter ? "translate-x-5" : "translate-x-0"
                }`}
              />
              <input
                type="checkbox"
                checked={editedIsBeforeAfter}
                onChange={(e) => setEditedIsBeforeAfter(e.target.checked)}
                aria-label="Enable before/after mode"
                className="absolute inset-0 size-full cursor-pointer appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-full"
              />
            </div>
            <span className="text-base font-medium text-gray-700 dark:text-gray-300">
              Before & After
            </span>
          </div>
        )}

        {/* Conditional Rendering: Before/After vs Regular */}
        {(isEditing ? editedIsBeforeAfter : displayIsBeforeAfter) ? (
          // Before/After Mode
          <div className="space-y-8">
            {/* Before Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Before
              </h4>
              {renderPhotoGrid(
                isEditing ? editedBeforePhotos : displayBeforePhotos,
                "before",
              )}
              {!isEditing && displayBeforePhotos.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                  <PhotoIcon className="size-10 mb-2" />
                  <p className="text-base font-medium">No before photos</p>
                </div>
              )}
            </div>

            {/* After Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                After
              </h4>
              {renderPhotoGrid(
                isEditing ? editedAfterPhotos : displayAfterPhotos,
                "after",
              )}
              {!isEditing && displayAfterPhotos.length === 0 && (
                <div className="flex flex-col items-center text-center justify-center py-8 text-zinc-400">
                  <PhotoIcon className="size-10 mb-2" />
                  <p className="text-base font-medium">
                    After photos will be added when job is complete
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Regular Mode
          <>
            {renderPhotoGrid(isEditing ? editedPhotos : block.photos, "photos")}

            {/* Empty state (view mode) */}
            {!isEditing && block.photos.length === 0 && (
              <div className="flex flex-col items-center text-center justify-center py-12 text-zinc-400">
                <PhotoIcon className="size-12 mb-2" />
                <p className="text-base font-medium">
                  After photos will be added when job is complete
                </p>
              </div>
            )}
          </>
        )}

        {/* Upload Error */}
        {uploadError && (
          <p className="mt-3 text-base text-red-500">{uploadError}</p>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </BlockShell>

      {/* Portal lightbox to document.body */}
      {mounted &&
        lightboxOpen &&
        lightboxPhotos.length > 0 &&
        createPortal(
          <Lightbox
            photos={lightboxPhotos}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
            onNavigate={setLightboxIndex}
            sidebarPinned={sidebarPinned}
          />,
          document.body,
        )}
    </>
  )
}
