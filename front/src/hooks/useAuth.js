import { useState, useEffect, useRef } from "react";

export function useAuth() {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        if (token) {
            // Annuler la requête précédente si elle existe
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Créer un nouveau contrôleur d'abandon
            abortControllerRef.current = new AbortController();

            fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
                headers: { Authorization: token },
                signal: abortControllerRef.current.signal
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error('Auth failed');
                })
                .then((data) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch((error) => {
                    // Ne pas déconnecter si la requête a été annulée
                    if (error.name !== 'AbortError') {
                        console.error('Auth error:', error);
                        setToken(null);
                        localStorage.removeItem("token");
                        setUser(null);
                    }
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }

        // Cleanup
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [token]);

    const login = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    return { token, user, me: user, loading, login, logout, isAuthenticated: !!token };
}
