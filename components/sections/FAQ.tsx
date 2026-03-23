"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { faqItems } from "@/lib/data";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section-padding relative z-10 bg-white">
      <h2 className="font-heading section-title mb-4 text-center text-5xl text-[#111111]">Guest FAQ</h2>
      <p className="mx-auto mb-10 max-w-xl text-center text-sm text-[#555]">Helpful answers for your celebration with us.</p>
      <div className="mx-auto max-w-2xl space-y-3">
        {faqItems.map((item, index) => {
          const open = openIndex === index;
          return (
            <motion.div
              key={item.question}
              className="overflow-hidden rounded-2xl border border-[#b23a48]/15 bg-[#fffdfd] shadow-sm"
              initial={false}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                aria-expanded={open}
              >
                <span className="font-heading text-lg font-medium text-[#111] md:text-xl">{item.question}</span>
                <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[#b23a48]" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-[#b23a48]/10 px-5 pb-4 pt-2 text-sm leading-relaxed text-[#444]">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
