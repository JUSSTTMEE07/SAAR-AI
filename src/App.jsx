import React from "react";
import {
  Navbar,
  Hero,
  Tool,
  HowItWorks,
  About,
  Footer,
} from "./components.jsx";
import "./index.css";

export default function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Tool />
      <HowItWorks />
      <About />
      <Footer />
    </>
  );
}
