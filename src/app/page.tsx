"use client"

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from "next/link";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

export default function Home() {
  const { setTheme } = useTheme()
  return (
    <main>
      <NavigationMenu>
        <NavigationMenuList>
          <Link href="">
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Education</NavigationMenuItem>
          </Link>
          <Link href="">
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Skills</NavigationMenuItem>
          </Link>
          <Link href="">
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Experience</NavigationMenuItem>
          </Link>
          <Link href="">
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Projects</NavigationMenuItem>
          </Link>
          <Link href="">
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Projects</NavigationMenuItem>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="grid grid-cols-2 gap-8 ">  
          <Card className="basis-1">
            <CardHeader>
              <div className=""></div>
            </CardHeader>
            <CardFooter>
              <h2>
                Let's create something!!!
              </h2>
            </CardFooter>
          </Card>
          <Card className="basis-2">
            <CardHeader>Eyo</CardHeader>
          </Card>
      </div>
    </main>
  );
}
