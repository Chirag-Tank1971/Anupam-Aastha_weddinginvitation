"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { events } from "@/lib/data";

export default function Events() {
  return (
    <section id="events" className="section-padding relative z-10 bg-white">
      <h2 className="font-heading mb-12 text-center text-5xl text-[#111111]">Wedding Events</h2>
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
        {events.map((event) => (
          <motion.article
            key={event.title}
            className="card-gradient overflow-hidden rounded-2xl p-0 transition-colors hover:border-[#b23a48]/50"
            whileHover={{ y: -8, scale: 1.01 }}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative h-52 w-full">
              <Image src={event.image} alt={event.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-3xl text-[#111111]">{event.title}</h3>
              <p className="mt-3 text-sm text-[#454545]">{event.date}</p>
              <p className="text-sm text-[#454545]">{event.time}</p>
              <p className="mt-2 text-sm tracking-wide text-[#b23a48]">{event.venue}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
