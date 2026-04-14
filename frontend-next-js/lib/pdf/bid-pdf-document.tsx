import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import type { BidBlock, HeaderBlock } from "@/lib/validations/bid"
import {
  PdfHeaderBlock,
  PdfContentBlock,
  PdfLocationBlock,
  PdfStepTrackerBlock,
  PdfPricingBlock,
  PdfPhotoBlock,
  PdfSignatureBlock,
} from "./pdf-blocks"

// ============================================
// DOCUMENT STYLES
// ============================================

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#f9fafb",
    fontFamily: "Helvetica",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#9ca3af",
  },
  pageNumber: {
    position: "absolute",
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: "#9ca3af",
  },
  generatedDate: {
    position: "absolute",
    bottom: 30,
    left: 40,
    fontSize: 9,
    color: "#9ca3af",
  },
})

// ============================================
// BLOCK RENDERER
// ============================================

function renderBlock(block: BidBlock, index: number) {
  switch (block.type) {
    case "header":
      return <PdfHeaderBlock key={`header-${index}`} block={block} />
    case "content":
      return <PdfContentBlock key={`content-${index}`} block={block} />
    case "location":
      return <PdfLocationBlock key={`location-${index}`} block={block} />
    case "stepTracker":
      return <PdfStepTrackerBlock key={`steps-${index}`} block={block} />
    case "pricing":
      return <PdfPricingBlock key={`pricing-${index}`} block={block} />
    case "photo":
      return <PdfPhotoBlock key={`photo-${index}`} block={block} />
    case "signature":
      return <PdfSignatureBlock key={`signature-${index}`} block={block} />
    default:
      return null
  }
}

// ============================================
// MAIN DOCUMENT
// ============================================

interface BidPdfDocumentProps {
  blocks: BidBlock[]
  title?: string
  generatedDate?: Date
}

export default function BidPdfDocument({
  blocks,
  title,
  generatedDate = new Date(),
}: BidPdfDocumentProps) {
  // Separate header from body blocks
  const headerBlock = blocks.find((b): b is HeaderBlock => b.type === "header")
  const bodyBlocks = blocks.filter((b) => b.type !== "header")

  const formattedDate = generatedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get company name for footer
  const companyName = headerBlock?.companyName || "Bid"

  return (
    <Document
      title={title || `${companyName} - Estimate`}
      author={companyName}
      subject="Project Estimate"
      creator="Pirate Ship"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        {headerBlock && renderBlock(headerBlock, 0)}

        {/* Body blocks */}
        {bodyBlocks.map((block, index) => renderBlock(block, index + 1))}

        {/* Footer */}
        <Text style={styles.generatedDate}>Generated {formattedDate}</Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}
