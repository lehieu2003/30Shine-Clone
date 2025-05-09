'use client'

import { Calendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StylistCardProps {
  name: string
  role: string
  specialties: Array<string>
  image: string
}

export default function StylistCard({
  name,
  role,
  specialties,
  image,
}: StylistCardProps) {
  return (
    <Card className="overflow-hidden animate-fade-up animate-once animate-duration-700 animate-delay-[calc(100ms*Math.random()*10)] animate-ease-in-out">
      <div className="aspect-3/4 relative">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{role}</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {specialties.map((specialty, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="animate-pulse animate-infinite animate-duration-[3000ms] animate-delay-[calc(500ms*index)]"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full gap-2 hover:animate-pulse hover:animate-once hover:animate-duration-500"
        >
          <Calendar className="h-4 w-4" />
          Đặt lịch với {name}
        </Button>
      </CardFooter>
    </Card>
  )
}
