import useSWR from "swr";

export const useGetTimezone = () => {
  const fetcher = async (url) => await fetch(url).then((res) => res.json());

  const { data, error } = useSWR("https://ipapi.co/json/", fetcher);

  if (error) return { userOffset: "America/New_York", userTimeZone: "-0400" };

  return { userOffset: data?.utc_offset, userTimeZone: data?.timezone };
};
