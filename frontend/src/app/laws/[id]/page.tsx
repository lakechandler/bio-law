import { Metadata } from "next";
import { getLawById } from "@/lib/api/laws";
import LawDetailClient from "@/components/laws/LawDetailClient";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const law = await getLawById(params.id);
  return {
    title: `${law.title} | Biology Laws Hub`,
    description: law.summary,
  };
}

export default async function LawDetailPage({ params }: { params: { id: string } }) {
  // Fetch the law data server-side
  const law = await getLawById(params.id);
  
  // Pass the data to a client component that can use dynamic imports with ssr: false
  return <LawDetailClient law={law} />;
} 