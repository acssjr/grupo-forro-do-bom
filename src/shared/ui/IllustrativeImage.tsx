import Image from "next/image";
import type { VisualAsset } from "@/modules/site/config/visualAssets";
import styles from "@/modules/site/components/landing/Landing.module.css";

type IllustrativeImageProps = {
  asset: VisualAsset;
  ratio?: "portrait" | "landscape" | "square" | "wide";
  className?: string;
  priority?: boolean;
  sizes?: string;
  depth?: "soft" | "medium";
};

export function IllustrativeImage({
  asset,
  ratio = "landscape",
  className = "",
  priority = false,
  sizes = "(max-width: 767px) 100vw, 50vw",
  depth = "soft",
}: IllustrativeImageProps) {
  return (
    <figure
      className={`${styles.illustrativeFigure} ${styles[ratio]} ${className}`}
      data-photo-reveal={priority ? undefined : true}
      data-depth={depth}
    >
      <div className={styles.illustrativeImageFrame}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          style={{ objectPosition: asset.position }}
          data-illustrative
        />
      </div>
      <figcaption>{asset.caption}</figcaption>
    </figure>
  );
}
