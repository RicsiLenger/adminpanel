'use client'

import React from "react";
import LoginForm from './ui/login/login';
import Image from "next/image";
import logo from "../public/knipl.logo.png";
import '@/app/globals.css';


export default function Home() {

  return (
    <div className="m-0 p-0 flex antialiased justify-center items-center min-h-screen">
      <div className=" flex flex-col justify-center items-center ">
        <Image className=""
          src={logo}
          alt="Knipl logo"
          width={550}
        />
        <div className="mb-5">
        <LoginForm/>
        </div>
      </div>
    </div>
);
}
