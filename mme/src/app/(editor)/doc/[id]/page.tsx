import { DocPageClient } from '@/app/(editor)/doc/[id]/DocPageClient'

export default async function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DocPageClient id={id} />
}

