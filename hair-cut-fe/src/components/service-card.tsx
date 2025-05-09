'use client'

import { Clock } from 'lucide-react'

import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

interface ServiceCardProps {
  title: string
  description: string
  price: number
  duration: number
  image: string
}

export default function ServiceCard({
  title,
  description,
  price,
  duration,
  image,
}: ServiceCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  return (
    <Card className="overflow-hidden animate-fade-up animate-once animate-duration-700 animate-delay-[calc(100ms*Math.random()*5)] animate-ease-in-out">
      <div className="aspect-video relative">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="font-medium text-lg">{formatPrice(price)}</span>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          {duration} phút
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full hover:animate-pulse hover:animate-once hover:animate-duration-500"
          asChild
        >
          <Link to="/booking">Đặt lịch ngay</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
