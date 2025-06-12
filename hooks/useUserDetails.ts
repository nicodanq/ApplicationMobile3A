import api from "@/api/axiosClient";
import { useEffect, useState } from "react";

export function useUserDetails(userId: number | null) {
  const [details, setDetails] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/id/${userId}`);
        setDetails(response.data);
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
        setError(err);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userId]);

  useEffect(() => {
    if (!details?.ID_user) return;

    const fetchRole = async () => {
      try {
        const response = await api.get(`/posseder/role/${details.ID_user}`);
        setRole(response.data?.role?.toLowerCase() ?? null);
      } catch (err) {
        console.error("Erreur récupération des rôles :", err);
        setError(err);
        setRole(null);
      }
    };

    fetchRole();
  }, [details?.ID_user]);

  return { details, role, loading, error };
}
