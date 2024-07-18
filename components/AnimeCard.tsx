// AnimeCard.tsx

import Image from "next/image";
import { MotionDiv } from "./MotionDiv";

export interface AnimeProp {
  id?: string;
  name?: string;
  title?: string;
  image?: {
    original?: string;
  };
  kind?: string;
  episodes?: number;
  episodes_aired?: number;
  score?: string;
}

interface Prop {
  anime: AnimeProp | undefined;
  index: number;
}

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

function AnimeCard({ anime, index }: Prop) {
  const name = anime?.name || anime?.title || "Unknown Anime";
  let imageSrc = anime?.image?.original || "/placeholder.jpg";

  // Check if the image URL starts with "https://" or "http://"
  if (!imageSrc.startsWith("https://") && !imageSrc.startsWith("http://")) {
    imageSrc = `https://shikimori.one${imageSrc}`;
  }

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.25,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
      className="max-w-sm rounded relative w-full"
    >
      <div className="relative w-full h-[37vh]">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="rounded-xl"
        />
      </div>
      <div className="py-4 flex flex-col gap-3">
        <div className="flex justify-between items-center gap-1">
          <h2 className="font-bold text-white text-xl line-clamp-1 w-full">
            {name}
          </h2>
          <div className="py-1 px-2 bg-[#161921] rounded-sm">
            <p className="text-white text-sm font-bold capitalize">
              {anime?.kind || "Unknown"}
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/episodes.svg"
              alt="episodes"
              width={20}
              height={20}
              className="object-contain"
            />
            <p className="text-base text-white font-bold">
              {anime?.episodes || anime?.episodes_aired || "N/A"}
            </p>
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Image
              src="/star.svg"
              alt="star"
              width={18}
              height={18}
              className="object-contain"
            />
            <p className="text-base font-bold text-[#FFAD49]">{anime?.score || "N/A"}</p>
          </div>
        </div>
      </div>
    </MotionDiv>
  );
}

export default AnimeCard;