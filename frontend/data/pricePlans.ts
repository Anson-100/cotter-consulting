import {
  DocumentCurrencyDollarIcon,
  UsersIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CloudIcon,
  CloudArrowUpIcon,
  StarIcon,
  InboxIcon,
  ChartBarSquareIcon,
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid"

// ---------------------------------------------------------------------
// 1. Hard-coded plans
// ---------------------------------------------------------------------
export const PRICE_PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Built for solo contractors.",
    featured: false,
    price: { monthly: "$5", annually: "$50" },

    features: [
      { icon: DocumentCurrencyDollarIcon, text: "Send up to 3 bids per month" },
      // { icon: UserIcon, text: "Single user" },
      { icon: InboxIcon, text: "Email support" },
      { icon: CloudArrowUpIcon, text: "5GB file storage" },
    ],
  },

  // {
  //   id: "pro",
  //   name: "Pro",
  //   description: "Built for small to medium businesses.",
  //   featured: true,
  //   price: { monthly: "$10", annually: "$100" },

  //   features: [
  //     {
  //       icon: DocumentCurrencyDollarIcon,
  //       text: "Send up to 10 bids per month",
  //     },
  //     // { icon: UsersIcon, text: "Up to 3 team members" },
  //     {
  //       icon: ChatBubbleLeftRightIcon,
  //       text: "Priority email support",
  //     },
  //     { icon: CloudArrowUpIcon, text: "25GB file storage" },
  //     // { icon: ChartBarSquareIcon, text: "Job analytics & tracking" },
  //   ],
  // },

  {
    id: "unlimited",
    name: "Unlimited",
    description: "Unlimited bids and all features unlocked.",
    featured: true,
    price: { monthly: "$25", annually: "$250" },

    features: [
      { icon: DocumentCurrencyDollarIcon, text: "Send unlimited bids" },
      // { icon: UserGroupIcon, text: "Unlimited team members" },
      { icon: ChatBubbleLeftRightIcon, text: "Priority email support" },
      { icon: CloudArrowUpIcon, text: "250GB file storage" },
      // { icon: ChartBarSquareIcon, text: "Job analytics & tracking" },
    ],
  },
] as const

// ---------------------------------------------------------------------
// 2. Feature comparison matrix
// ---------------------------------------------------------------------
export const PRICE_FEATURES = [
  {
    name: "Features",
    features: [
      {
        name: "Edge content delivery",
        tiers: { Starter: true, Pro: true, Unlimited: true },
      },
      {
        name: "Custom domains",
        tiers: { Starter: "1", Pro: "3", Unlimited: "Unlimited" },
      },
      {
        name: "Team members",
        tiers: { Starter: "3", Pro: "10", Unlimited: "Unlimited" },
      },
      {
        name: "Single sign-on (SSO)",
        tiers: { Starter: false, Pro: false, Unlimited: true },
      },
    ],
  },
  {
    name: "Reporting",
    features: [
      {
        name: "Advanced analytics",
        tiers: { Starter: true, Pro: true, Unlimited: true },
      },
      {
        name: "Basic reports",
        tiers: { Starter: false, Pro: true, Unlimited: true },
      },
      {
        name: "Professional reports",
        tiers: { Starter: false, Pro: false, Unlimited: true },
      },
      {
        name: "Custom report builder",
        tiers: { Starter: false, Pro: false, Unlimited: true },
      },
    ],
  },
  {
    name: "Support",
    features: [
      {
        name: "24/7 online support",
        tiers: { Starter: true, Pro: true, Unlimited: true },
      },
      {
        name: "Quarterly workshops",
        tiers: { Starter: false, Pro: true, Unlimited: true },
      },
      {
        name: "Priority phone support",
        tiers: { Starter: false, Pro: false, Unlimited: true },
      },
      {
        name: "1:1 onboarding tour",
        tiers: { Starter: false, Pro: false, Unlimited: true },
      },
    ],
  },
] as const

// ---------------------------------------------------------------------
// 1b. Deferred/Free Trial plan (separate so it doesn't get mapped with paid plans)
// ---------------------------------------------------------------------
export const DEFERRED_PLAN = {
  id: "deferred",
  name: "Try It Free",
  description: "Test the platform before committing.",
  featured: false,
  features: [
    {
      icon: DocumentCurrencyDollarIcon,
      text: "2 free bids to test the platform",
    },
    { icon: CheckCircleIcon, text: "Full access to all features" },
    { icon: ClockIcon, text: "Choose a plan after your second bid" },
    {
      icon: CreditCardIcon,
      text: "Card on file, but not charged until upgrade",
    },
  ],
} as const
