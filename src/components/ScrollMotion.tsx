"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * ページ全体のスクロール演出をここにまとめる。
 * - [data-scrub-x]：巨大な文字が、スクロールに合わせて左右に流れる（1 で右へ、-1 で左へ）
 * - [data-hero-word]：最初の巨大な文字が、スクロールで上下に割れて流れる
 * - .section-title：見出しが下から出る（0.5秒）
 * prefers-reduced-motion では何もしない（全部、最後の状態で見える）。
 */
export function ScrollMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-scrub-x]").forEach((el) => {
        const dir = Number(el.dataset.scrubX) || -1;
        gsap.fromTo(
          el,
          { xPercent: dir > 0 ? -18 : 6 },
          {
            xPercent: dir > 0 ? 6 : -18,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
          },
        );
      });

      const words = gsap.utils.toArray<HTMLElement>("[data-hero-word]");
      words.forEach((el) => {
        const second = el.dataset.heroWord === "2";
        gsap.to(el, {
          xPercent: second ? 30 : -22,
          yPercent: second ? 10 : -6,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.4 },
        });
      });
      gsap.from(words, { yPercent: 40, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.08 });

      gsap.utils.toArray<HTMLElement>(".section-title, .feature-title").forEach((el) => {
        gsap.from(el, {
          yPercent: 60,
          opacity: 0,
          duration: 0.5,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.to(".marquee", {
        rotate: -2,
        ease: "none",
        scrollTrigger: { trigger: ".marquee", start: "top bottom", end: "bottom top", scrub: 0.5 },
      });
    });
  });
  return null;
}
