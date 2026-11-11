"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { sceneState } from "@/lib/sceneState";

/** Feeds the contact scene: the book closes as the section arrives. */
export default function ContactMotion() {
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: "[data-contact]",
      start: "top 85%",
      end: "center center",
      scrub: true,
      onUpdate: (self) => (sceneState.contact.progress = self.progress),
    });
    return () => st.kill();
  }, []);
  return null;
}
