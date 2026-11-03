"use client";

import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places", "drawing", "geometry"];

const GoogleLoadedContext = createContext(false);

export const useIsGoogleLoaded = () => useContext(GoogleLoadedContext);

const GoogleProvider = ({ children }) => {
  const { isLoaded: scriptLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDjQDvqNwowt2108udIQqat__nuE0W2AaA",
    libraries: libraries,
    language: "fr",
  });

  return (
    <GoogleLoadedContext.Provider value={scriptLoaded}>
      {children}
    </GoogleLoadedContext.Provider>
  );
};

export default GoogleProvider;
