import * as React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FaJava, FaPython, FaDocker, FaPhp, FaVuejs } from "react-icons/fa";
import { SiNeovim, SiFlutter, SiFlask, SiDjango, SiDart } from "react-icons/si";
import { BiLogoSpringBoot } from "react-icons/bi";

export function SkillGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <FaJava size={80}/>
          <CardTitle className="text-center">Java</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <FaPython size={80}/>
          <CardTitle className="text-center">Python</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <FaDocker size={80}/>
          <CardTitle className="text-center">Docker</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <SiDjango size={80}/>
          <CardTitle className="text-center">Django</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <FaPhp size={80}/>
          <CardTitle className="text-center">Php</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <SiDart size={80}/>
          <CardTitle className="text-center">Dart</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <FaVuejs size={80}/>
          <CardTitle className="text-center">Vue.js</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center flex flex-col items-center">
          <BiLogoSpringBoot size={80}/>
          <CardTitle className="text-center">SpringBoot</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <FaVuejs size={80}/>
          <CardTitle className="text-center">Vue.js</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <SiFlask size={80}/>
          <CardTitle className="text-center">Flask</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <SiFlutter size={80}/>
          <CardTitle className="text-center">Flutter</CardTitle>
        </CardHeader>
      </Card>
      <Card className="bg-accent flex flex-col items-center">
        <CardHeader className="text-center">
          <SiNeovim size={80}/>
          <CardTitle className="text-center">Neovim</CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
