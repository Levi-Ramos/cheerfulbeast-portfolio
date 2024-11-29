import * as React from "react"
 
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
 
export function ProjectCarousel() {
  return (
    <Carousel className="w-full max-w-2xl">
      <CarouselContent>
          <CarouselItem key={0}>
            <div className="p-1">
              <Card>
                <CardHeader className="text-center">Restaurant Ordering System w/ multi-language Feature</CardHeader>
                <CardContent className="flex items-center h-80 justify-around p-6 overflow-hidden">
                  <img src="/homepage.jpg" className="h-64" />
                  <img src="/homepage2.jpg" className="h-64" />
                  <img src="/productPage.jpg" className="h-64" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem key={1}>
            <div className="p-1">
              <Card>
                <CardHeader className="text-center">Request Document Management System</CardHeader>
                <CardContent className="flex flex-col items-center h-80 justify-around p-6 overflow-hidden">
                  <img src="/dswd_dashboard.png" className="h-64" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
          <CarouselItem key={2}>
            <div className="p-1">
              <Card>
                <CardHeader className="text-center">Custom Neovim Config using LazyVim</CardHeader>
                <CardContent className="flex flex-col items-center h-80 justify-around p-6 overflow-hidden">
                  <img src="/nvim.png" className="h-64" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
