"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { galleryImages } from "@/lib/data";

export default function Gallery() {
  const [index, setIndex] = useState(-1);

  return (
    <section id="gallery" className="section-padding relative z-10 bg-[#fafafa]">
      <h2 className="font-heading mb-12 text-center text-5xl text-[#111111]">Gallery</h2>
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 md:grid-cols-3">
        {galleryImages.map((src, imageIndex) => (
          <motion.button
            key={src}
            className="relative aspect-[4/5] overflow-hidden rounded-xl border border-[#b23a48]/10 shadow-sm"
            onClick={() => setIndex(imageIndex)}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Image
              src={src}
              alt={`Gallery image ${imageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k="
            />
          </motion.button>
        ))}
      </div>

      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={galleryImages.map((src) => ({ src }))}
      />
    </section>
  );
}
