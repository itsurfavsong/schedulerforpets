import { useState } from 'react';
import axios from 'axios';
import { AddressResult, KakaoAddressResponse } from '../types/address.types';

const KAKAO_REST_API_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY;

export const useAddressSearch = () => {
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchAddress = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get<KakaoAddressResponse>(
        'https://dapi.kakao.com/v2/local/search/address.json',
        {
          params: { query },
          headers: {
            Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
          },
        },
      );
      setResults(response.data.documents);
    } catch (error) {
      console.error('주소 검색 실패:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearResults = () => setResults([]);

  return { results, isSearching, searchAddress, clearResults };
};