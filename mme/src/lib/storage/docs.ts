import { db, type DocRecord } from '@/lib/storage/db'
import { deriveTitleFromDoc } from '@/lib/storage/deriveTitle'

export async function getDoc(id: string): Promise<DocRecord | undefined> {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/89024530-8f73-4cef-8d09-73c663c3de70', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: `log_${Date.now()}_getDoc`,
      timestamp: Date.now(),
      location: 'src/lib/storage/docs.ts:getDoc',
      message: 'getDoc called',
      runId: 'pre-fix',
      hypothesisId: 'A',
      data: {
        id,
        type: typeof id,
        isNull: id === null,
        isArray: Array.isArray(id),
      },
    }),
  }).catch(() => {})
  // #endregion

  if (!id || Array.isArray(id)) {
    return undefined
  }

  return db.docs.get(id)
}

export async function listDocs(): Promise<DocRecord[]> {
  return db.docs.orderBy('updatedAt').reverse().toArray()
}

export async function createDoc(id: string, initialContent?: any): Promise<DocRecord> {
  const now = Date.now()
  const content = initialContent ?? { type: 'doc', content: [{ type: 'paragraph' }] }
  const doc: DocRecord = {
    id,
    title: deriveTitleFromDoc(content),
    content,
    createdAt: now,
    updatedAt: now,
  }
  await db.docs.put(doc)
  return doc
}

export async function upsertDocContent(id: string, content: any): Promise<void> {
  const now = Date.now()
  const existing = await db.docs.get(id)
  if (!existing) {
    await createDoc(id, content)
    return
  }
  await db.docs.update(id, {
    content,
    title: deriveTitleFromDoc(content),
    updatedAt: now,
  })
}

export async function deleteDoc(id: string): Promise<void> {
  await db.docs.delete(id)
}

