// src/pages/home/HomePage.js
import React, { useState } from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import SectionFilter from "./SectionFilter";
import CarouselRank from "../../components/home/CarouselRank";
import ShowGrid from "../../components/home/ShowGrid";

const HomePage = () => {
  const [selectedFilter, setSelectedFilter] = useState("top20");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto p-4">
        <SectionFilter selected={selectedFilter} onChange={setSelectedFilter} />
        <CarouselRank filter={selectedFilter} />
        <ShowGrid />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
