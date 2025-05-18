// /src/routes/admin-services/schemas/serviceSchema.ts
import { z } from 'zod'

export const stepSchema = z.object({
  stepOrder: z.number().positive('Thứ tự phải là số dương'),
  stepTitle: z.string().min(1, 'Tiêu đề bước không được để trống'),
  stepDescription: z.string().optional(),
  stepImageUrl: z.string().optional(),
})

export const serviceSchema = z.object({
  serviceName: z.string().min(1, 'Tên dịch vụ không được để trống'),
  estimatedTime: z.number().positive('Thời gian phải là số dương'),
  price: z.number().positive('Giá phải là số dương'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  bannerImageUrl: z.string().min(1, 'URL hình ảnh không được để trống'),
  categoryId: z.number().int().positive('Danh mục là bắt buộc'), // Ensure categoryId is required
  isActive: z.boolean().optional(),
  steps: z.array(stepSchema).optional(),
})

// /src/types/service.ts
export interface Step {
  stepOrder: number
  stepTitle: string
  stepDescription?: string
  stepImageUrl?: string
  id?: number
}

export interface Service {
  id: number
  serviceName: string
  estimatedTime: number
  price: number
  description: string
  bannerImageUrl: string
  categoryId: number // Add categoryId to Service interface
  isActive?: boolean // Add isActive to Service interface
  steps?: Array<Step>
  createdAt?: string
  updatedAt?: string
}

// Schema for general service info (without steps)
export const serviceInfoSchema = z.object({
  serviceName: z.string().min(1, 'Tên dịch vụ không được để trống'),
  estimatedTime: z.number().positive('Thời gian phải là số dương'),
  price: z.coerce.number().positive('Giá phải là số dương'),
  description: z.string().min(1, 'Mô tả không được để trống'),
  bannerImageUrl: z.string().min(1, 'URL hình ảnh không được để trống'),
})
