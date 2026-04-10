"use client";

import { useJsApiLoader } from "@react-google-maps/api";
import { Spin } from "antd";

const libraries = ["places", "drawing", "geometry"];

const GoogleProvider = ({ children }) => {
  const { isLoaded: scriptLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDjQDvqNwowt2108udIQqat__nuE0W2AaA",
    libraries: libraries,
    language: "fr",
  });

  if (loadError) return <p>Encountered error while loading google maps</p>;

  if (!scriptLoaded) return <Spin />;

  return children;
};

export default GoogleProvider;
