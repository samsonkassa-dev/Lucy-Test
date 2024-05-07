import useSWR from "swr";

export const useGetUserCountryCallingCode = () => {
  const fetcher = async (url) => await fetch(url).then((res) => res.json());

  const { data, error } = useSWR("https://ipapi.co/json/", fetcher);

  if (error) return console.log("couldn't obtain country");
  return {
    country: data?.country_name,
    code: data?.country_calling_code.replace("+", ""),
  };
};
