import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Bid } from "@/lib/validations/bid"
import BidView from "./bid-view"

interface BidPageProps {
  params: Promise<{ id: string }>
}

export default async function BidPage({ params }: BidPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch the bid - no auth required for public viewing
  const { data: bid, error } = await supabase
    .from("bids")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !bid) {
    notFound()
  }

  // Update status to "viewed" if it's still "sent"
  if (bid.status === "sent") {
    await supabase.from("bids").update({ status: "viewed" }).eq("id", id)
  }

  return <BidView bid={bid as Bid} />
}
