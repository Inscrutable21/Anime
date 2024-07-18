// app/action.tsx

"use server";

import AnimeCard, { AnimeProp } from "@/components/AnimeCard";

export async function fetchAnime(page: number, searchQuery: string = "") {
  const response = await fetch(
    `https://shikimori.one/api/animes?page=${page}&limit=8&order=popularity&search=${encodeURIComponent(searchQuery)}`
  );

  const data = await response.json();

  return data.map((item: AnimeProp, index: number) => (
    <AnimeCard key={item.id} anime={item} index={index} />
  ));
}