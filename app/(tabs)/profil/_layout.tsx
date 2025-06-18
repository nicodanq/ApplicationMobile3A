import { Stack } from "expo-router";

export default function ProfilLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ⛔️ aucun header sur toutes les pages de ce dossier
      }}
    />
  );
}