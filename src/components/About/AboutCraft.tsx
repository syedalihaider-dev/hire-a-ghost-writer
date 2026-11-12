import { aboutCraft } from "@/content/aboutContent";
import ChapterHead from "./ChapterHead";
import CraftIndex from "./CraftIndex";
import styles from "./AboutCraft.module.css";

/** Chapter III — the services, as an editorial index rather than a card grid. */
export default function AboutCraft() {
  const c = aboutCraft;
  return (
    <section id="craft" className={`surface-ink ${styles.craft}`} aria-labelledby="craft-title">
      <div className="container">
        <ChapterHead chapter={c.chapter} label={c.label} title={c.title} id="craft-title" intro={c.intro} />
        <CraftIndex />
      </div>
    </section>
  );
}
