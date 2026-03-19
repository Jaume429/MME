import Dexie, { type Table } from 'dexie'

export type DocRecord = {
  id: string
  title: string
  content: any
  createdAt: number
  updatedAt: number
}

class AppDB extends Dexie {
  docs!: Table<DocRecord, string>

  constructor() {
    super('mme_docs')
    this.version(1).stores({
      docs: 'id, updatedAt, createdAt, title',
    })
  }
}

export const db = new AppDB()

