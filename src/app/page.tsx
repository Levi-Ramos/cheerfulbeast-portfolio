/* eslint-disable react/no-unescaped-entities */
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
import Starfield from "react-starfield";
import React, { useEffect, useState } from 'react';
import profilePic from "../../public/profile.jpg";
import { DiGithubBadge } from "react-icons/di";
import { FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [starColor, setStarColor] = useState<[number, number, number]>([255, 255, 255]);
  const [bgColor, setBgColor] = useState('#000000');

  useEffect(() => {
    if (theme === 'dark') {
      setStarColor([255, 255, 255]); // Stars are white
      setBgColor('#020818'); // Background is black
    } else {
      setStarColor([0, 0, 0]); // Stars are black
      setBgColor('#FFFFFF'); // Background is white
    }
  }, [theme]);

  return (
    <main className="relative">
      {/* Starfield background */}
      <div className="absolute inset-0 -z-10">
        <Starfield backgroundColor={bgColor} starCount={1000} speedFactor={0.05} starColor={starColor} />
      </div><NavigationMenu>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setTheme("light");
              }}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setTheme("dark");
              }}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="grid grid-cols-4 flex-row md:gap-x-4 gap-y-4 mx-4 sm:mx-0">
        <Card className="md:col-span-3 col-span-4 relative">
          <CardHeader />
          <CardContent className="overflow-hidden md:pr-40 pr-6">
            <CardTitle className="text-3xl font-semibold">Let's work together ! ! !</CardTitle>
            <CardDescription>I specialize in building scalable and efficient full-stack applications tailored to meet diverse client needs. With experience in developing mobile and web solutions, I've worked with frameworks like Laravel, Flutter, and Quasar, integrating robust APIs and utilizing state management techniques such as Bloc. My expertise spans building dynamic apps, implementing complex features like offline-first functionality, and integrating external services like Kill Bill for subscription management. Whether it's crafting intuitive UIs or ensuring backend reliability, I thrive on transforming innovative ideas into impactful, user-centered solutions. Let's collaborate to bring your vision to life!</CardDescription>
          </CardContent>
          <CardFooter className="space-x-6 bottom-0 position">
            <Button>
              <FaGithub />
              GitHub
            </Button>
            <Button><FaLinkedinIn />LinkedIn</Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-1 col-span-4 overflow-hidden">
          <CardContent className="bg-profile-image bg-cover md:h-36 h-96">
          </CardContent>
          <CardFooter className="flex flex-col justify-start items-start mt-6">
            <CardTitle>
              Hi, I'm Levi
            </CardTitle>
            <CardDescription>
              A result-driven full-stack developer who has expertise in web and mobile development using Flutter, Springboot, Vue.js, and so much more...
            </CardDescription>
          </CardFooter>
        </Card>
        <Card className="md:col-span-3 col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Education</CardTitle>
            <div className="flex flex-col md:flex-row justify-around">
              <div className="flex flex-col items-center">
                <p className="font-semibold">2020 - 2024</p>
                <CardDescription className="italic text-center">Bachelor of Science in Information Technology</CardDescription>
                <CardDescription className="italic text-center">Major in Business Technology Management</CardDescription>
                <Separator className="mt-2 hidden md:block" />
                <CardDescription className="text-center"> University of Southeastern Philippines</CardDescription>
                <CardDescription className="text-center">Obrero, Davao City</CardDescription>
              </div>
              <Separator className="mt-2 md:hidden block" />
              <div className="flex flex-col items-center">
                <p className="font-semibold">2018 - 2020</p>
                <CardDescription className="italic text-center">Science, Technology, Engineering, Mathematics (STEM)</CardDescription>
                <CardDescription className="italic text-center">Pre Computer Science</CardDescription>
                <Separator className="mt-2 hidden md:block" />
                <CardDescription className="text-center">Ateneo de Davao University</CardDescription>
                <CardDescription className="text-center">Bangkal, Davao City</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Phone: 0928 023 0975</CardDescription>
            <CardDescription>Email: leviramos59@gmail.com</CardDescription>
          </CardContent>
          <CardFooter>
            <Button>Email Me</Button>
          </CardFooter>
        </Card>
        <Card className="col-span-1 md:col-span-4">
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </main >
  );
}
