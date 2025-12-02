/**
 * Location Service - HTTP Adapter
 * Service layer untuk operasi lokasi (gedung, lantai, ruangan) menggunakan HTTP/REST API
 */

import { ERROR_MESSAGES } from '../../../constants'
import { getErrorMessage } from '../../utils/errorHandling'
import { logger } from '../../utils/logger'
import { api } from '../client'
import type {
  Building,
  CreateBuildingData,
  CreateFloorData,
  CreateRoomData,
  Floor,
  ILocationService,
  Room,
} from './types'

class HttpLocationService implements ILocationService {
  /**
   * Get all buildings
   */
  async getBuildings(): Promise<Building[]> {
    try {
      logger.info('LocationService', 'Fetching buildings')
      const response = await api.get<Building[]>('/locations/buildings')
      const data = Array.isArray(response.data) ? response.data : []
      logger.success('LocationService', `Fetched ${data.length} buildings`)
      return data
    } catch (error) {
      logger.error('LocationService', 'Failed to fetch buildings', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get floors by building ID
   */
  async getFloors(buildingId: number): Promise<Floor[]> {
    try {
      logger.info(
        'LocationService',
        `Fetching floors for building ID: ${buildingId}`
      )
      const response = await api.get<Floor[]>(
        `/locations/buildings/${buildingId}/floors`
      )
      const data = Array.isArray(response.data) ? response.data : []
      logger.success('LocationService', `Fetched ${data.length} floors`)
      return data
    } catch (error) {
      logger.error(
        'LocationService',
        `Failed to fetch floors for building ID: ${buildingId}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Get rooms by floor ID
   */
  async getRooms(floorId: number): Promise<Room[]> {
    try {
      logger.info('LocationService', `Fetching rooms for floor ID: ${floorId}`)
      const response = await api.get<Room[]>(
        `/locations/floors/${floorId}/rooms`
      )
      const data = Array.isArray(response.data) ? response.data : []
      logger.success('LocationService', `Fetched ${data.length} rooms`)
      return data
    } catch (error) {
      logger.error(
        'LocationService',
        `Failed to fetch rooms for floor ID: ${floorId}`,
        error
      )
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Create new building
   */
  async createBuilding(data: CreateBuildingData): Promise<Building> {
    try {
      logger.info('LocationService', 'Creating building', { name: data.name })
      const response = await api.post<Building>('/locations/buildings', data)
      logger.success(
        'LocationService',
        `Created building: ${response.data.name}`
      )
      return response.data
    } catch (error) {
      logger.error('LocationService', 'Failed to create building', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Create new floor
   */
  async createFloor(data: CreateFloorData): Promise<Floor> {
    try {
      logger.info('LocationService', 'Creating floor', data)
      const response = await api.post<Floor>('/locations/floors', data)
      logger.success(
        'LocationService',
        `Created floor level: ${response.data.levelNumber}`
      )
      return response.data
    } catch (error) {
      logger.error('LocationService', 'Failed to create floor', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }

  /**
   * Create new room
   */
  async createRoom(data: CreateRoomData): Promise<Room> {
    try {
      logger.info('LocationService', 'Creating room', { name: data.name })
      const response = await api.post<Room>('/locations/rooms', data)
      logger.success('LocationService', `Created room: ${response.data.name}`)
      return response.data
    } catch (error) {
      logger.error('LocationService', 'Failed to create room', error)
      throw new Error(getErrorMessage(error) || ERROR_MESSAGES.VALIDATION_ERROR)
    }
  }
}

// Export singleton instance
export const locationService: ILocationService = new HttpLocationService()
