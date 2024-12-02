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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { ProjectCarousel } from "@/components/project_carousel"
import { SkillGrid } from "@/components/skill_grid"

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const [starColor, setStarColor] = useState<[number, number, number]>([255, 255, 255]);
  const [bgColor, setBgColor] = useState('#000000');

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setStarColor([255, 255, 255]); // Stars are white
      setBgColor('#020818'); // Background is black
    } else {
      setStarColor([0, 0, 0]); // Stars are black
      setBgColor('#FFFFFF'); // Background is white
    }
  }, [resolvedTheme]);

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - (window.innerHeight / 2 - element.clientHeight / 2),
        behavior: 'smooth',
      });
    }
  };

  return (
    <main className="relative">
      {/* Starfield background */}
      <div className="absolute inset-0 -z-10">
        <Starfield backgroundColor={bgColor} starCount={1000} speedFactor={0.05} starColor={starColor} />
      </div>
      <NavigationMenu>
        <NavigationMenuList>
          <Link href="#education" onClick={(e) => scrollToSection(e, 'education')}>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Education</NavigationMenuItem>
          </Link>
          <Link href="#skills" onClick={(e) => scrollToSection(e, 'skills')}>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Skills</NavigationMenuItem>
          </Link>
          <Link href="#experience" onClick={(e) => scrollToSection(e, 'experience')}>
            <NavigationMenuItem className={navigationMenuTriggerStyle()}>Experience</NavigationMenuItem>
          </Link>
          <Link href="#projects" onClick={(e) => scrollToSection(e, 'projects')}>
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
            <Button asChild>
              <Link href="https://github.com/Levi-Ramos">
                <FaGithub />
                GitHub
              </Link>
            </Button>
            <Button asChild>
              <Link href="https://www.linkedin.com/in/rowserowserowse/">
                <FaLinkedinIn />LinkedIn
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card className="md:col-span-1 col-span-4 overflow-hidden">
          <CardHeader>
            <CardTitle>
              Hi, I'm Levi
            </CardTitle>
            <CardDescription>
              A result-driven full-stack developer who has expertise in web and mobile development using Flutter, Springboot, Vue.js, and so much more...
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="col-span-4 md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Phone: (+63) 928 023 0975</CardDescription>
            <CardDescription>Email: leviramos59@gmail.com</CardDescription>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link rel="noreferrer" target="_blank" href="mailto:leviramos59@gmail.com">
                Email Me
              </Link>
            </Button>
          </CardFooter>
        </Card>
        <Card id="education" className="md:col-span-3 col-span-4" >
          <CardHeader>
            <CardTitle className="text-lg text-center">Education</CardTitle>
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
        <Card id="experience" className="col-span-4 w-full flex flex-col items-center justify-center" hoverEffect={false}>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex flex-row justify-around border rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold">Full-Stack Developer</p>
                      <p className="font-thin">July 2024 - Present</p>
                      <p className="font-thin">Apollo Technologies, Inc.</p>
                      <p className="font-thin text-xs">Obrero, Davao City</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-96 text-justify text-xs font-extralight">
                  During my time at the company, I gained a full-stack experience, with a primary focus on front-end development while also contributing to backend tasks. I successfully deployed a new UI reskin using Vue.js and the Quasar Framework. The majority of my efforts were dedicated to developing a mobile application with Flutter, utilizing BLoc for state management. I was also tasked with cooperating with another dev team improve the back-end of their service which utilizes the KillBill open source API
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex flex-row justify-around border rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold">Full-Stack Developer Intern</p>
                      <p className="font-thin">Nov 2023 - Feb 2024</p>
                      <p className="font-thin">NHTS Department, DSWD</p>
                      <p className="font-thin text-xs">Bago Oshiro, Davao City</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-96 text-justify text-xs font-extralight">
                  In my internship in DSWD, i was tasked in developing a request document management system that would be used by the Region XI of DSWD which has a SMS/email notification feature and cloud storage. I had a full-stack experience in making this system including the engineering side of it. I was also tasked in complying to quality assurance demands for deployment
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex flex-row justify-around border rounded-lg p-6">
                    <div className="flex flex-col items-center">
                      <p className="font-semibold">Back-End Developer Intern</p>
                      <p className="font-thin">July 2023 - Oct 2023</p>
                      <p className="font-thin">Next BPO Solutions, Inc.</p>
                      <p className="font-thin text-xs">Sandawa, Ecoland, Davao City</p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-96 text-justify text-xs font-extralight">
                  This is my first industry experience so I had a lot of learning. I was tasked in developing a backend employee module for their system that would be used by the company for their internal use. Its mostly simple rest api functions but it was a good start for me to understand how things work in the industry.
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardContent>
        </Card>
        <Card id="projects" className="col-span-4" hoverEffect={false}>
          <CardHeader><CardTitle className="text-center">Projects</CardTitle></CardHeader>
          <CardContent className="flex justify-center">
            <ProjectCarousel />
          </CardContent>
        </Card>
        <Card id="skills" className="col-span-4" hoverEffect={false}>
          <CardHeader><CardTitle className="text-center">Skills</CardTitle></CardHeader>
          <CardContent>
            <SkillGrid />
          </CardContent>
        </Card>
      </div>
    </main >
  );
}
