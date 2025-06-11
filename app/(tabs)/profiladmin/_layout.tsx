import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ⛔️ aucun header sur toutes les pages de ce dossier
      }}
    />
  );
}