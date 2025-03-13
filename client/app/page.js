import { Button } from "@/components/ui/button";
import Image from "next/image";
import Header from "./Header";
import Hero from "./Hero";

export default function Home() {



  return (
    <div className="md:px-16 lg:px-24 xl:px-36 w-100 ">

      {/* Header */}
      <Header />

      {/* Hero */}
      <Hero />

    </div>
  );
}
