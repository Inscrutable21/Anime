// LoadMore.tsx

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import AnimeCard from "./AnimeCard";

export type AnimeCard = JSX.Element;

interface LoadMoreProps {
  onLoadMore: (page: number) => Promise<AnimeCard[]>;
}

function LoadMore({ onLoadMore }: LoadMoreProps) {
  const { ref, inView } = useInView();
  const [data, setData] = useState<AnimeCard[]>([]);
  const [page, setPage] = useState(2);

  useEffect(() => {
    if (inView) {
      onLoadMore(page).then((res) => {
        setData([...data, ...res]);
        setPage(prev => prev + 1);
      });
    }
  }, [inView, data, onLoadMore, page]);

  return (
    <>
      <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {data}
      </section>
      <section className="flex justify-center items-center w-full">
        <div ref={ref}>
          <Image
            src="./spinner.svg"
            alt="spinner"
            width={56}
            height={56}
            className="object-contain"
          />
        </div>
      </section>
    </>
  );
}

export default LoadMore;