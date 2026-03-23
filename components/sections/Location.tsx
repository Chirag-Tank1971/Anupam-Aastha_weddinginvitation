"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { locationTabs } from "@/lib/data";

export default function Location() {
  const [activeTab, setActiveTab] = useState(locationTabs[0].id);
  const [activeLocationName, setActiveLocationName] = useState(locationTabs[0].locations[0].name);
  const [mapLoaded, setMapLoaded] = useState(false);

  const currentTab = useMemo(() => locationTabs.find((tab) => tab.id === activeTab) ?? locationTabs[0], [activeTab]);
  const currentLocation = useMemo(
    () => currentTab.locations.find((location) => location.name === activeLocationName) ?? currentTab.locations[0],
    [currentTab, activeLocationName]
  );

  useEffect(() => {
    setActiveLocationName(currentTab.locations[0].name);
  }, [currentTab]);

  useEffect(() => {
    setMapLoaded(false);
  }, [currentLocation.mapQuery]);

  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(currentLocation.mapQuery)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  const mapSearch = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLocation.mapQuery)}`;

  return (
    <section id="location" className="section-padding relative z-10 bg-white">
      <h2 className="font-heading section-title mb-10 text-center text-5xl text-[#111111]">How To Reach Us</h2>
      <motion.div
        className="card-gradient mx-auto max-w-4xl overflow-hidden rounded-3xl p-5 md:p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto mb-5 flex w-full max-w-2xl rounded-full border border-[#111]/15 bg-[#f4f4f4] p-1">
          {locationTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-full px-3 py-2 text-xs uppercase tracking-[0.16em] transition md:text-sm ${
                activeTab === tab.id ? "bg-[#111] text-white" : "text-[#5b5b5b] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {currentTab.locations.map((location) => (
            <button
              key={`${currentTab.id}-${location.name}`}
              onClick={() => setActiveLocationName(location.name)}
              className={`rounded-full border px-3 py-1.5 text-xs tracking-wide transition ${
                activeLocationName === location.name
                  ? "border-[#b23a48] bg-[#b23a48] text-white"
                  : "border-[#b23a48]/25 bg-white text-[#5a5a5a] hover:border-[#b23a48]/50"
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        <div className="relative h-[360px] overflow-hidden rounded-2xl bg-[#f0f0f0]">
          {!mapLoaded && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-[#eee] to-[#f8f8f8]">
              <div className="h-10 w-10 animate-pulse rounded-full border-2 border-[#b23a48]/30 border-t-[#b23a48]" />
              <p className="text-xs uppercase tracking-widest text-[#888]">Loading map…</p>
            </div>
          )}
          <iframe
            title="Wedding location map"
            src={mapEmbed}
            className={`h-full w-full transition-opacity duration-500 ${mapLoaded ? "opacity-100" : "opacity-0"}`}
            loading="lazy"
            onLoad={() => setMapLoaded(true)}
          />
        </div>
        <div className="mt-4 rounded-2xl border border-[#b23a48]/20 bg-white p-4 text-center">
          <p className="font-heading text-2xl text-[#111]">{currentLocation.name}</p>
          <p className="mt-1 text-sm text-[#444]">{currentLocation.city}</p>
          <p className="text-sm text-[#444]">{currentLocation.address}</p>
        </div>
        <div className="mt-5 flex justify-center">
          <a
            href={mapSearch}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#b23a48]/45 px-6 py-3 text-xs uppercase tracking-[0.2em] text-[#b23a48] transition hover:bg-[#b23a48] hover:text-white"
          >
            Get Directions
          </a>
        </div>
      </motion.div>
    </section>
  );
}
