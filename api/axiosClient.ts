// api/axiosClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { urlAPI } from "../config"; // Assure-toi d'exporter l'URL dans config ou dans un fichier de config séparé

const axiosClient = axios.create({
    baseURL: urlAPI, // Utilise la constante importée
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur : ajoute automatiquement le token dans les headers
axiosClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("session");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
