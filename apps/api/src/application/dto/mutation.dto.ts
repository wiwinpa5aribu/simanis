import { AssetMutation } from '@simanis/database'

export type MutationDto = AssetMutation

export interface MutationListDto {
  mutations: MutationDto[]
}
