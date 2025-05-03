import { useEffect, useRef, useState } from "react";
import api from "../api/api";

const usePagination = <T>({
  url,
  initialPage,
  params,
  useScrolltoEnd,
  pageIncrement,
  enabled = true,
}: {
  url: string,
  initialPage: number;
  pageIncrement: (page: number) => number
  useScrolltoEnd?: boolean;
  params?: Record<string, string>;
  enabled?: boolean;
}) => {
  const [isPending, setPending] = useState(enabled);
  const [isFetcing, setFetching] = useState(enabled);
  const [error, setError] = useState<unknown>();
  const [data, setData] = useState<T[]>([]);
  const [isQueryUp, setQueryUp] = useState(enabled);
  const [hasData, setHasData] = useState(true)

  const pageNumber = useRef<number>(initialPage);
  const initialized = useRef<boolean>(false);
  const firstPageFetched = useRef<boolean>(false);

  const handleScrolltoEnd = () => {
    if (!useScrolltoEnd) {
      return;
    }
    if(!firstPageFetched.current){
        return
    }
    setTimeout(() => {
      window.scrollTo({ top: document.body.clientHeight });
    }, 100);
  };

  const handlePageParams = () => {
    const searchParams = new URLSearchParams();
    searchParams.set("_start", pageNumber.current.toString());

    if (params) {
      Object.entries(params).forEach((entry) => {
        searchParams.set(entry[0], entry[1]);
      });
    }

    return searchParams.toString();
  };

  const fetch = async () => {
    try {
      setQueryUp(true);
      if (!firstPageFetched.current) {
        setPending(true);
      }
      setFetching(true);
      const params = handlePageParams();
      const response = await api.get(`${url}?${params}`);
      setData((prev) => [...prev, ...response.data]);
      handleScrolltoEnd();
      firstPageFetched.current = true;
      if(!response.data.length){
        setHasData(false)
      }
    } catch (e: unknown) {
      setError(e);
    } finally {
      setFetching(false);
      setPending(false);
    }
  };

  const handleFetchNextPage = () => {
    pageNumber.current += pageIncrement(pageNumber.current);
    fetch();
  };

  useEffect(() => {
    if (initialized.current) {
      return;
    }
    if (!enabled) {
      return;
    }
    initialized.current = true;
    fetch();
  }, []);

  return {
    error,
    data,
    isFetcing,
    isPending,
    isQueryUp,
    hasData,
    handleFetchNextPage,
    refetch: fetch,
    isError: error !== undefined,
  };
};

export default usePagination;
