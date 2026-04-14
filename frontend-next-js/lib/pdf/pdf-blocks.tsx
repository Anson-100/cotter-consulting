import { Text, View, Image, Link, StyleSheet } from "@react-pdf/renderer"
import type {
  HeaderBlock,
  ContentBlock,
  LocationBlock,
  StepTrackerBlock,
  PricingBlock,
  PhotoBlock,
  SignatureBlock,
} from "@/lib/validations/bid"

// ============================================
// SHARED STYLES
// ============================================

const styles = StyleSheet.create({
  // Typography
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  h2: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  h3: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 2,
  },
  body: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.4,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  small: {
    fontSize: 10,
    color: "#6b7280",
  },

  // Layout
  block: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    border: "1 solid #e5e7eb",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spacer: {
    height: 8,
  },

  // Header specific
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 16,
    borderBottom: "2 solid #e5e7eb",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    objectFit: "contain",
  },
  contactInfo: {
    alignItems: "flex-end",
  },

  // Content block
  item: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 2,
  },
  itemContent: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.4,
  },

  // Step tracker
  step: {
    flexDirection: "row",
    marginBottom: 10,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#e0e7ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#4f46e5",
  },
  stepContent: {
    flex: 1,
  },
  substep: {
    marginLeft: 36,
    marginTop: 4,
    paddingLeft: 8,
    borderLeft: "2 solid #e5e7eb",
  },

  // Photos
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  photo: {
    width: "48%",
    height: 150,
    objectFit: "cover",
    borderRadius: 4,
  },
  photoCaption: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 2,
    textAlign: "center",
  },

  // Location
  address: {
    fontSize: 11,
    color: "#4b5563",
    lineHeight: 1.5,
  },
  link: {
    fontSize: 10,
    color: "#4f46e5",
    marginTop: 4,
  },
})

// ============================================
// BLOCK RENDERERS
// ============================================

export function PdfHeaderBlock({ block }: { block: HeaderBlock }) {
  return (
    <View style={styles.headerContainer}>
      <View>
        {block.logoUrl && (
          <Image src={block.logoUrl} style={styles.logo} />
        )}
        <Text style={styles.h1}>{block.companyName}</Text>
        {block.tagline && (
          <Text style={styles.subtitle}>{block.tagline}</Text>
        )}
      </View>
      <View style={styles.contactInfo}>
        {block.phone && <Text style={styles.body}>{block.phone}</Text>}
        {block.email && <Text style={styles.body}>{block.email}</Text>}
      </View>
    </View>
  )
}

export function PdfContentBlock({ block }: { block: ContentBlock }) {
  return (
    <View style={styles.block}>
      <Text style={styles.h2}>{block.header}</Text>
      {block.items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemContent}>{item.content}</Text>
        </View>
      ))}
    </View>
  )
}

export function PdfLocationBlock({ block }: { block: LocationBlock }) {
  return (
    <View style={styles.block}>
      <Text style={styles.h2}>{block.header}</Text>
      <Text style={styles.address}>{block.address}</Text>
      {block.url && (
        <Link src={block.url} style={styles.link}>
          View on map →
        </Link>
      )}
    </View>
  )
}

export function PdfStepTrackerBlock({ block }: { block: StepTrackerBlock }) {
  return (
    <View style={styles.block}>
      <Text style={styles.h2}>{block.header}</Text>
      {block.subtitle && (
        <Text style={[styles.small, { marginBottom: 12 }]}>{block.subtitle}</Text>
      )}
      {block.steps.map((step, index) => (
        <View key={step.id}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.h3}>{step.name}</Text>
              {step.description && (
                <Text style={styles.body}>{step.description}</Text>
              )}
            </View>
          </View>
          {step.substeps?.map((substep) => (
            <View key={substep.id} style={styles.substep}>
              <Text style={styles.small}>• {substep.name}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}

export function PdfPricingBlock({ block }: { block: PricingBlock }) {
  const total = block.lineItems.reduce((sum, item) => sum + item.amount, 0)
  const deposit = Math.round(total * (block.depositPercent / 100))
  const balance = total - deposit

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <View style={styles.block}>
      <Text style={styles.h2}>{block.header}</Text>

      {/* Line items */}
      {block.lineItems.map((item) => (
        <View
          key={item.id}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <Text style={styles.body}>{item.description}</Text>
          <Text style={[styles.body, { fontWeight: "bold" }]}>
            {formatCurrency(item.amount)}
          </Text>
        </View>
      ))}

      {/* Divider */}
      <View
        style={{
          borderTop: "1 solid #e5e7eb",
          marginTop: 8,
          paddingTop: 8,
        }}
      >
        {/* Total */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 4,
          }}
        >
          <Text style={[styles.h3, { marginBottom: 0 }]}>Total</Text>
          <Text style={[styles.h3, { marginBottom: 0 }]}>
            {formatCurrency(total)}
          </Text>
        </View>

        {/* Deposit / Balance */}
        {total > 0 && (
          <>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 2,
              }}
            >
              <Text style={styles.small}>
                Deposit ({block.depositPercent}%)
              </Text>
              <Text style={styles.small}>{formatCurrency(deposit)}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.small}>Balance due</Text>
              <Text style={styles.small}>{formatCurrency(balance)}</Text>
            </View>
          </>
        )}
      </View>

      {/* Payment terms */}
      {block.paymentTerms && (
        <Text style={[styles.small, { marginTop: 8 }]}>
          {block.paymentTerms}
        </Text>
      )}
    </View>
  )
}

export function PdfSignatureBlock({ block }: { block: SignatureBlock }) {
  const signers = block.signers || []

  return (
    <View style={styles.block}>
      <Text style={styles.h2}>{block.header}</Text>

      {block.bodyText && (
        <Text style={[styles.body, { marginBottom: 16 }]}>{block.bodyText}</Text>
      )}

      {signers.map((signer, idx) => (
        <View key={signer.id} style={{ marginTop: idx > 0 ? 20 : 0 }}>
          {signer.label && (
            <Text style={[styles.h3, { marginBottom: 6 }]}>{signer.label}</Text>
          )}

          {/* Signature image or empty line */}
          <View style={{ marginBottom: 8, minHeight: 50 }}>
            {signer.signatureData ? (
              <Image
                src={signer.signatureData}
                style={{ width: "100%", height: 50, objectFit: "contain" }}
              />
            ) : (
              <View style={{ height: 50 }} />
            )}
            <View style={{ borderTop: "1 solid #9ca3af", marginTop: 4, paddingTop: 4 }}>
              <Text style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                Signature
              </Text>
            </View>
          </View>

          {/* Name / Title / Date row */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.body, { minHeight: 14 }]}>
                {signer.signerName || ""}
              </Text>
              <View style={{ borderTop: "1 solid #d1d5db", paddingTop: 4, marginTop: 2 }}>
                <Text style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                  Printed name
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.body, { minHeight: 14 }]}>
                {signer.signerTitle || ""}
              </Text>
              <View style={{ borderTop: "1 solid #d1d5db", paddingTop: 4, marginTop: 2 }}>
                <Text style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                  Title
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.body, { minHeight: 14 }]}>
                {signer.dateSigned || ""}
              </Text>
              <View style={{ borderTop: "1 solid #d1d5db", paddingTop: 4, marginTop: 2 }}>
                <Text style={{ fontSize: 8, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1 }}>
                  Date
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

export function PdfPhotoBlock({ block }: { block: PhotoBlock }) {
  const photos = block.isBeforeAfter
    ? [...(block.beforePhotos || []), ...(block.afterPhotos || [])]
    : block.photos || []

  if (photos.length === 0) return null

  return (
    <View style={styles.block}>
      <Text style={styles.h2}>{block.header}</Text>
      {block.isBeforeAfter && (
        <Text style={[styles.small, { marginBottom: 8 }]}>Before & After</Text>
      )}
      <View style={styles.photoGrid}>
        {photos.map((photo) => (
          <View key={photo.id} style={{ width: "48%" }}>
            <Image src={photo.url} style={styles.photo} />
            {photo.caption && (
              <Text style={styles.photoCaption}>{photo.caption}</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  )
}
