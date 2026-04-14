import { pdf } from "@react-pdf/renderer"
import type { BidBlock } from "@/lib/validations/bid"
import BidPdfDocument from "./bid-pdf-document"

/**
 * Generate a PDF blob from bid blocks
 */
export async function generateBidPdf(
  blocks: BidBlock[],
  title?: string,
): Promise<Blob> {
  const doc = <BidPdfDocument blocks={blocks} title={title} />
  const blob = await pdf(doc).toBlob()
  return blob
}

/**
 * Download a PDF for a bid
 */
export async function downloadBidPdf(
  blocks: BidBlock[],
  filename?: string,
  title?: string,
): Promise<void> {
  try {
    const blob = await generateBidPdf(blocks, title)

    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename || "estimate.pdf"

    // Trigger download
    document.body.appendChild(link)
    link.click()

    // Cleanup
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Failed to generate PDF:", error)
    throw error
  }
}

/**
 * Open PDF in new tab for viewing/printing
 */
export async function viewBidPdf(
  blocks: BidBlock[],
  title?: string,
): Promise<void> {
  try {
    const blob = await generateBidPdf(blocks, title)
    const url = URL.createObjectURL(blob)
    window.open(url, "_blank")
  } catch (error) {
    console.error("Failed to generate PDF:", error)
    throw error
  }
}
