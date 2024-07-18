// ClientHome.tsx

"use client";

import { useState, useEffect } from 'react';
import AnimeCard, { AnimeProp } from "./AnimeCard";
import LoadMore from "./LoadMore";
import { data as localData } from "@/app/_data";
import { fetchAnime } from "@/app/action";

export default function ClientHome({ initialAnimeData }: { initialAnimeData: JSX.Element[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAnime, setFilteredAnime] = useState<AnimeProp[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allAnimeData, setAllAnimeData] = useState<AnimeProp[]>([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const extractedData = initialAnimeData
      .map((animeElement: any) => animeElement.props.anime)
      .filter(Boolean); // This removes any undefined or null items
    setAllAnimeData([...localData, ...extractedData]);
  }, [initialAnimeData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    await performSearch();
  };

  const performSearch = async () => {
    const localFiltered = allAnimeData.filter((anime) => {
      if (!anime) return false; // Skip undefined or null items
      const name = anime.name || anime.title || '';
      return name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  
    try {
      const apiResponse = await fetchAnime(1, searchQuery);
      const apiData = apiResponse.map((animeElement: any) => animeElement.props.anime);
      const combinedResults = [...localFiltered, ...apiData];
      setFilteredAnime(combinedResults);
      setHasMore(apiData.length === 8); // Assuming API returns 8 items per page
    } catch (error) {
      console.error("Error fetching API data:", error);
      setFilteredAnime(localFiltered);
      setHasMore(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value === '') {
      setIsSearching(false);
      setFilteredAnime([]);
    }
  };

  const loadMoreResults = async (page: number) => {
    if (!isSearching) return [];
    
    try {
      const apiResponse = await fetchAnime(page, searchQuery);
      const apiData = apiResponse.map((animeElement: any) => animeElement.props.anime);
      setFilteredAnime(prev => [...prev, ...apiData]);
      setHasMore(apiData.length === 8);
      return apiResponse;
    } catch (error) {
      console.error("Error fetching more results:", error);
      setHasMore(false);
      return [];
    }
  };

  const loadMoreInitial = async (page: number) => {
    try {
      const apiResponse = await fetchAnime(page);
      setAllAnimeData(prev => [...prev, ...apiResponse.map((animeElement: any) => animeElement.props.anime)]);
      setHasMore(apiResponse.length === 8);
      return apiResponse;
    } catch (error) {
      console.error("Error fetching more initial results:", error);
      setHasMore(false);
      return [];
    }
  };

  const animeToDisplay = isSearching ? filteredAnime : allAnimeData;

  return (
    <>
      <form onSubmit={handleSearch} className="flex gap-4 mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search anime..."
          className="flex-1 px-4 py-2 rounded-md text-white bg-[#161921] border border-[#343434]"
        />
        <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded-md">
          Search
        </button>
      </form>

      <section className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
  {animeToDisplay.length > 0 ? (
    animeToDisplay.map((anime, index) => (
      anime && <AnimeCard 
        key={`${index}-${anime.id || anime.name || ''}`} 
        anime={anime} 
        index={index} 
      />
    ))
  ) : (
    isSearching && <p className="col-span-full text-center text-white text-xl">No results found</p>
  )}
</section>
      
      {hasMore && (
        <LoadMore onLoadMore={isSearching ? loadMoreResults : loadMoreInitial} />
      )}
    </>
  );
}