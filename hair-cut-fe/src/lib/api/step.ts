import apiClient from '@/lib/api'

export async function createStep(stepData: any) {
  const response = await apiClient.post(`/api/steps`, stepData)
  return response.data
}

export async function updateStep(stepId: string, stepData: any) {
  const response = await apiClient.patch(`/api/steps/${stepId}`, stepData)
  return response.data
}

export async function deleteStep(stepId: string) {
  const response = await apiClient.delete(`/api/steps/${stepId}`)
  return response.data
}

export async function updateStepOrder(steps: Array<any>) {
  const response = await apiClient.patch(`/api/steps/order`, { payload: steps })
  return response.data
}
