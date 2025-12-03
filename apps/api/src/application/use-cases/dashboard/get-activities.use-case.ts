import { IAuditRepository } from '../../../domain/repositories/audit.repository'

export interface RecentActivity {
  id: number
  type: 'asset' | 'mutation' | 'loan' | 'inventory'
  title: string
  description: string
  timestamp: string
  link?: string
}

export class GetActivitiesUseCase {
  constructor(private auditRepository: IAuditRepository) {}

  async execute(limit: number = 10): Promise<RecentActivity[]> {
    const { logs } = await this.auditRepository.findAll({
      page: 1,
      pageSize: limit,
    })

    return logs.map((log) => {
      const type = this.mapEntityTypeToActivityType(log.entityType)
      const title = this.generateTitle(log.action, log.entityType)
      const description = this.generateDescription(log)
      const link = this.generateLink(type, log.entityId)

      return {
        id: log.id,
        type,
        title,
        description,
        timestamp: log.timestamp.toISOString(),
        link,
      }
    })
  }

  private mapEntityTypeToActivityType(
    entityType: string
  ): 'asset' | 'mutation' | 'loan' | 'inventory' {
    const typeMap: Record<string, 'asset' | 'mutation' | 'loan' | 'inventory'> =
      {
        Asset: 'asset',
        AssetMutation: 'mutation',
        Loan: 'loan',
        InventoryCheck: 'inventory',
      }
    return typeMap[entityType] || 'asset'
  }

  private generateTitle(action: string, entityType: string): string {
    const actionMap: Record<string, string> = {
      CREATE: 'Ditambahkan',
      UPDATE: 'Diperbarui',
      DELETE: 'Dihapus',
    }
    const entityMap: Record<string, string> = {
      Asset: 'Aset',
      AssetMutation: 'Mutasi Aset',
      Loan: 'Peminjaman',
      InventoryCheck: 'Inventarisasi',
    }
    return `${entityMap[entityType] || entityType} ${actionMap[action] || action}`
  }

  private generateDescription(log: {
    action: string
    entityType: string
    entityId: number
    user?: { name: string } | null
  }): string {
    const userName = log.user?.name || 'Sistem'
    const entityName = this.getEntityDisplayName(log.entityType)

    switch (log.action) {
      case 'CREATE':
        return `${entityName} baru telah ditambahkan oleh ${userName}`
      case 'UPDATE':
        return `${entityName} telah diperbarui oleh ${userName}`
      case 'DELETE':
        return `${entityName} telah dihapus oleh ${userName}`
      default:
        return `Aktivitas pada ${entityName} oleh ${userName}`
    }
  }

  private getEntityDisplayName(entityType: string): string {
    const nameMap: Record<string, string> = {
      Asset: 'Aset',
      AssetMutation: 'Mutasi aset',
      Loan: 'Peminjaman',
      InventoryCheck: 'Inventarisasi',
    }
    return nameMap[entityType] || entityType
  }

  private generateLink(type: string, entityId: number): string | undefined {
    const linkMap: Record<string, string> = {
      asset: `/assets/${entityId}`,
      mutation: `/mutations`,
      loan: `/loans/${entityId}`,
      inventory: `/inventory`,
    }
    return linkMap[type]
  }
}
