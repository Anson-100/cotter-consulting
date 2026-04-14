"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Bid, BidBlock, UpdateBidInput } from "@/lib/validations/bid"

type SaveStatus = "idle" | "saving" | "saved" | "error"

interface UseBidOptions {
  debounceMs?: number
  initialBlocks?: BidBlock[]
}

interface UseBidReturn {
  bid: Bid | null
  bidId: string | undefined
  blocks: BidBlock[]
  isLoading: boolean
  isSaving: boolean
  saveStatus: SaveStatus
  error: string | null
  updateBlock: (index: number, updatedBlock: BidBlock) => void
  addBlock: (block: BidBlock, index?: number) => void
  removeBlock: (index: number) => void
  reorderBlocks: (fromIndex: number, toIndex: number) => void
  save: () => Promise<void>
}

export function useBid(
  bidId?: string,
  options: UseBidOptions = {}
): UseBidReturn {
  const { debounceMs = 800, initialBlocks = [] } = options

  // Core state
  const [bid, setBid] = useState<Bid | null>(null)
  const [currentBidId, setCurrentBidId] = useState<string | undefined>(bidId)
  const [blocks, setBlocks] = useState<BidBlock[]>(initialBlocks)
  const [isLoading, setIsLoading] = useState(!!bidId)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const blocksRef = useRef<BidBlock[]>(blocks)

  // Keep ref in sync with state (for use in async callbacks)
  useEffect(() => {
    blocksRef.current = blocks
  }, [blocks])

  // Fetch existing bid on mount
  useEffect(() => {
    if (!bidId) {
      setIsLoading(false)
      return
    }

    const fetchBid = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`/api/bids/${bidId}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to fetch bid")
        }

        const data: Bid = await res.json()
        setBid(data)
        setBlocks(data.blocks || [])
        setCurrentBidId(data.id)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bid")
      } finally {
        setIsLoading(false)
      }
    }

    fetchBid()
  }, [bidId])

  // Persist to API
  const persistBid = useCallback(
    async (blocksToSave: BidBlock[]) => {
      setIsSaving(true)
      setSaveStatus("saving")
      setError(null)

      try {
        if (currentBidId) {
          // Update existing bid
          const updatePayload: UpdateBidInput = { blocks: blocksToSave }
          const res = await fetch(`/api/bids/${currentBidId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatePayload),
          })

          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || "Failed to update bid")
          }

          const updated: Bid = await res.json()
          setBid(updated)
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus("idle"), 2000)
        } else {
          // Create new bid
          const res = await fetch("/api/bids", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blocks: blocksToSave }),
          })

          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || "Failed to create bid")
          }

          const created: Bid = await res.json()
          setBid(created)
          setCurrentBidId(created.id) // This will trigger re-render and URL update
          setSaveStatus("saved")
          setTimeout(() => setSaveStatus("idle"), 2000)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save bid")
        setSaveStatus("error")
      } finally {
        setIsSaving(false)
      }
    },
    [currentBidId]
  )

  // Debounced save - uses ref to get latest blocks
  const debouncedSave = useCallback(
    (blocksToSave: BidBlock[]) => {
      setSaveStatus("saving")

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      debounceTimer.current = setTimeout(() => {
        persistBid(blocksToSave)
      }, debounceMs)
    },
    [debounceMs, persistBid]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  // Block operations
  const updateBlock = useCallback(
    (index: number, updatedBlock: BidBlock) => {
      setBlocks((prev) => {
        const newBlocks = [...prev]
        newBlocks[index] = updatedBlock
        debouncedSave(newBlocks)
        return newBlocks
      })
    },
    [debouncedSave]
  )

  const addBlock = useCallback(
    (block: BidBlock, index?: number) => {
      setBlocks((prev) => {
        const newBlocks = [...prev]
        if (index !== undefined) {
          newBlocks.splice(index, 0, block)
        } else {
          newBlocks.push(block)
        }
        debouncedSave(newBlocks)
        return newBlocks
      })
    },
    [debouncedSave]
  )

  const removeBlock = useCallback(
    (index: number) => {
      setBlocks((prev) => {
        const newBlocks = prev.filter((_, i) => i !== index)
        debouncedSave(newBlocks)
        return newBlocks
      })
    },
    [debouncedSave]
  )

  const reorderBlocks = useCallback(
    (fromIndex: number, toIndex: number) => {
      setBlocks((prev) => {
        const newBlocks = [...prev]
        const [removed] = newBlocks.splice(fromIndex, 1)
        newBlocks.splice(toIndex, 0, removed)
        debouncedSave(newBlocks)
        return newBlocks
      })
    },
    [debouncedSave]
  )

  // Manual save
  const save = useCallback(async () => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    await persistBid(blocksRef.current)
  }, [persistBid])

  return {
    bid,
    bidId: currentBidId,
    blocks,
    isLoading,
    isSaving,
    saveStatus,
    error,
    updateBlock,
    addBlock,
    removeBlock,
    reorderBlocks,
    save,
  }
}
