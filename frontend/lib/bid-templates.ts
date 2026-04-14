import type {
  HeaderBlock,
  StepTrackerBlock,
  LocationBlock,
  ContentBlock,
  PricingBlock,
  BidBlock,
  PhotoBlock,
  SignatureBlock,
} from "@/lib/validations/bid"

// ============================================
// DEFAULT BLOCK TEMPLATES
// ============================================

export const defaultHeaderBlock: HeaderBlock = {
  type: "header",
  companyName: "Your Company",
  tagline: "Your tagline",
  logoUrl: undefined,
  phone: "(555) 555-5555",
  email: "you@example.com",
}

export const defaultStepTrackerBlock: StepTrackerBlock = {
  type: "stepTracker",
  header: "Scope of work",
  subtitle: "Click or tap each step to view details",
  steps: [
    {
      id: "1",
      name: "Step 1",
      description: "First step description",
      status: "upcoming",
    },
    {
      id: "2",
      name: "Step 2",
      description: "Second step description",
      status: "upcoming",
    },
    {
      id: "3",
      name: "Step 3",
      description: "Third step description",
      status: "upcoming",
    },
  ],
}

export const defaultLocationBlock: LocationBlock = {
  type: "location",
  header: "Project location",
  address: "123 Main Street\nCity, ST 12345",
}

export const defaultBillingBlock: ContentBlock = {
  type: "content",
  header: "Billing details",
  icon: "InformationCircleIcon",
  items: [
    {
      title: "Total Estimated Cost",
      content: "Enter the total cost and payment breakdown.",
    },
    {
      title: "Preferred Payment",
      content: "Enter your preferred payment method.",
    },
    {
      title: "Payment Terms",
      content: "Enter your payment terms.",
    },
  ],
}

export const defaultPricingBlock: PricingBlock = {
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
  paymentTerms:
    "Deposit is due before the start of the job. The remaining balance is due upon completion.",
  showBreakdownToCustomer: false,
  notes: [],
}

export const defaultMaterialsBlock: ContentBlock = {
  type: "content",
  header: "Materials used",
  icon: "PaintBrushIcon",
  items: [
    {
      title: "Material 1",
      content: "Description of material.",
    },
  ],
}

export const defaultInfoBlock: ContentBlock = {
  type: "content",
  header: "Important information",
  icon: "ClockIcon",
  items: [
    {
      title: "Timeline",
      content: "Project timeline details.",
    },
  ],
}

export const defaultSignatureBlock: SignatureBlock = {
  type: "signature",
  header: "Authorization",
  bodyText:
    "By signing below, I authorize the work described in this estimate and agree to the terms outlined above.",
  signers: [
    { id: "1", label: "Contractor" },
    { id: "2", label: "Customer" },
  ],
}

export const defaultPhotoBlock: PhotoBlock = {
  type: "photo",
  header: "Project photos",
  isBeforeAfter: false,
  photos: [],
  beforePhotos: [],
  afterPhotos: [],
}

// ============================================
// SAMPLE DATA (for demo/testing)
// ============================================

export const sampleHeaderBlock: HeaderBlock = {
  type: "header",
  companyName: "Modern System",
  tagline: "Concrete & Painting",
  logoUrl: undefined,
  phone: "(419) 296-6222",
  email: "ansonjjwh@gmail.com",
}

export const sampleStepTrackerBlock: StepTrackerBlock = {
  type: "stepTracker",
  header: "Side door and trim repaint - scope of work",
  subtitle: "Click or tap each step to view details",
  steps: [
    {
      id: "1",
      name: "Prep",
      description: "Prepare surfaces for primer and paint",
      status: "upcoming",
      substeps: [
        { id: "1.1", name: "Remove delaminating paint", status: "upcoming" },
        {
          id: "1.2",
          name: "Sand all surfaces for adhesion and uniform texture",
          status: "upcoming",
        },
      ],
    },
    {
      id: "2",
      name: "Prime",
      description: "Apply primer",
      status: "upcoming",
      substeps: [
        {
          id: "2.1",
          name: "Apply Extreme Bond primer for max adhesion to existing surfaces",
          status: "upcoming",
        },
      ],
    },
    {
      id: "3",
      name: "Paint",
      description: "Apply Urethane Enamel finish paint",
      status: "upcoming",
      substeps: [
        {
          id: "3.1",
          name: "Apply 2 coats Emerald Urethane Enamel finish for maximum UV protection, durability, and scratch resistance",
          status: "upcoming",
        },
      ],
    },
  ],
}

export const sampleLocationBlock: LocationBlock = {
  type: "location",
  header: "Project location",
  address: "401 Capulet Drive\nVenice, FL 34292",
  url: "https://maps.app.goo.gl/n1ua5vyL3mfqGnpz9",
}

export const sampleBillingBlock: ContentBlock = {
  type: "content",
  header: "Billing details",
  icon: "InformationCircleIcon",
  items: [
    {
      title: "Total Estimated Cost",
      content:
        "The total for this project is $414, split into two payments of $207. This price includes all labor and materials required to complete the job.",
    },
    {
      title: "Preferred Payment",
      content: "Check or Zelle is the preferred method of payment.",
    },
    {
      title: "Payment Terms",
      content:
        "Half of the quoted price is due prior to the start of the job. The remaining balance is due after the project is complete.",
    },
    {
      title: "Scope & Extras",
      content:
        "This estimate includes all labor outlined in the scope of work and all materials required to complete the job. If any unexpected issues arise or additional work is requested, the quote will be revised and submitted for approval before proceeding.",
    },
  ],
}

export const samplePricingBlock: PricingBlock = {
  type: "pricing",
  header: "Pricing",
  showLineItems: true,
  lineItems: [
    { id: "1", description: "Labor", amount: 300 },
    { id: "2", description: "Materials (primer + paint)", amount: 114 },
  ],
  showBillableHours: false,
  hourlyRate: 0,
  hourEntries: [],
  depositPercent: 50,
  paymentTerms:
    "Half of the quoted price is due prior to the start of the job. The remaining balance is due after the project is complete. Check or Zelle preferred.",
  showBreakdownToCustomer: false,
  notes: [],
}

export const sampleMaterialsBlock: ContentBlock = {
  type: "content",
  header: "Materials used",
  icon: "PaintBrushIcon",
  items: [
    {
      title: "Sherwin Williams Extreme Bond Primer",
      content: "Guarantees maximum adhesion to existing surfaces.",
    },
    {
      title: "Sherwin Williams Emerald Urethane Trim Enamel",
      content:
        "Excellent UV protection, scratch resistance, and a smooth, durable finish.",
    },
    {
      title: "Leftover Paint",
      content:
        "Customer will keep the remaining Emerald Urethane for future touch-ups.",
    },
  ],
}

export const sampleResultsBlock: ContentBlock = {
  type: "content",
  header: "Important information for best results",
  icon: "ClockIcon",
  items: [
    {
      title: "Project Duration",
      content:
        "This project will be completed over a period of 2 days to ensure proper preparation, application, and curing time between coats.",
    },
    {
      title: "Door Use After Completion",
      content:
        "Please keep use of the door to a minimum for 7 days after completion to allow the paint to harden. Full curing will occur over 30 days.",
    },
  ],
}

// ============================================
// STARTER TEMPLATE
// ============================================

export function getStarterBlocks(): BidBlock[] {
  return [
    sampleHeaderBlock,
    sampleStepTrackerBlock,
    sampleLocationBlock,
    samplePricingBlock,
    sampleMaterialsBlock,
    sampleResultsBlock,
  ]
}

// ============================================
// BLANK TEMPLATE
// ============================================

export function getBlankBlocks(): BidBlock[] {
  return [
    {
      type: "header",
      companyName: "Your Company",
      logoUrl: undefined,
    },
    {
      type: "location",
      header: "Project location",
      address: "",
    },
    {
      type: "content",
      header: "Project details",
      icon: "InformationCircleIcon",
      items: [
        {
          title: "Description",
          content: "",
        },
      ],
    },
  ]
}
