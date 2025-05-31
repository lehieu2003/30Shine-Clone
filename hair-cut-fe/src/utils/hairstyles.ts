export interface HairstyleData {
  id: string
  name: string
  category: string
  imageUrl: string
  thumbnail: string
  description?: string
  tags?: Array<string>
}

export const hairstyleCategories = [
  { id: 'all', name: 'All Styles' },
  { id: 'modern', name: 'Modern' },
  { id: 'classic', name: 'Classic' },
  { id: 'trendy', name: 'Trendy' },
  { id: 'minimal', name: 'Minimal' },
  { id: 'long', name: 'Long Hair' },
  { id: 'short', name: 'Short Hair' },
]

// Sample hairstyle data - in production, this would come from your API
export const sampleHairstyles: Array<HairstyleData> = [
  {
    id: '1',
    name: 'Modern Undercut',
    category: 'modern',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=200&fit=crop&crop=face',
    description:
      'A sleek, modern undercut that works great for professional settings',
    tags: ['professional', 'clean', 'modern'],
  },
  {
    id: '2',
    name: 'Classic Pompadour',
    category: 'classic',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=200&fit=crop&crop=face',
    description: 'Timeless pompadour style with volume and elegance',
    tags: ['vintage', 'formal', 'classic'],
  },
  {
    id: '3',
    name: 'Textured Crop',
    category: 'trendy',
    imageUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=200&fit=crop&crop=face',
    description: 'Contemporary textured crop with natural movement',
    tags: ['casual', 'natural', 'easy-style'],
  },
  {
    id: '4',
    name: 'Side Swept',
    category: 'classic',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=200&fit=crop&crop=face',
    description: 'Elegant side-swept style suitable for any occasion',
    tags: ['versatile', 'business', 'formal'],
  },
  {
    id: '5',
    name: 'Clean Buzz Cut',
    category: 'minimal',
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=200&fit=crop&crop=face',
    description: 'Ultra-low maintenance buzz cut for active lifestyles',
    tags: ['minimal', 'low-maintenance', 'athletic'],
  },
  {
    id: '6',
    name: 'Layered Flow',
    category: 'long',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=200&fit=crop&crop=face',
    description: 'Long layered style with natural flow and movement',
    tags: ['long', 'layers', 'bohemian'],
  },
  {
    id: '7',
    name: 'Fade Cut',
    category: 'modern',
    imageUrl:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=200&fit=crop&crop=face',
    description: 'Clean fade with modern styling on top',
    tags: ['fade', 'clean', 'contemporary'],
  },
  {
    id: '8',
    name: 'Messy Quiff',
    category: 'trendy',
    imageUrl:
      'https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?w=300&h=400&fit=crop&crop=face',
    thumbnail:
      'https://images.unsplash.com/photo-1531591022136-eb8b0da1e6d0?w=150&h=200&fit=crop&crop=face',
    description: 'Stylishly messy quiff with texture and volume',
    tags: ['messy', 'volume', 'casual'],
  },
]

export const getHairstylesByCategory = (
  category: string,
): Array<HairstyleData> => {
  if (category === 'all') {
    return sampleHairstyles
  }
  return sampleHairstyles.filter((style) => style.category === category)
}

export const getHairstyleById = (id: string): HairstyleData | undefined => {
  return sampleHairstyles.find((style) => style.id === id)
}

export const searchHairstyles = (query: string): Array<HairstyleData> => {
  const lowercaseQuery = query.toLowerCase()
  return sampleHairstyles.filter(
    (style) =>
      style.name.toLowerCase().includes(lowercaseQuery) ||
      style.description?.toLowerCase().includes(lowercaseQuery) ||
      style.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}
