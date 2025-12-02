import { AssetMutation } from '@prisma/client'

export type MutationDto = AssetMutation

export interface MutationListDto {
  mutations: MutationDto[]
}
