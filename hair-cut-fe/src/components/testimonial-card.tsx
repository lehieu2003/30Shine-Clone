import { Star } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface TestimonialCardProps {
  name: string
  quote: string
  rating: number
  image: string
}

export default function TestimonialCard({
  name,
  quote,
  rating,
  image,
}: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <img
              src={image || '/placeholder.svg'}
              alt={name}
              className="h-full w-full object-cover"
            />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <blockquote className="text-muted-foreground italic">
          "{quote}"
        </blockquote>
      </CardContent>
    </Card>
  )
}
