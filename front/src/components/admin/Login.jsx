import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.message !== "ok") {
        setError(data.message);
        toast.error(data.message);
      } else if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.reload();
      }
    } catch (err) {
      setError("Erreur de connexion");
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Connexion Admin</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                type="text"
                id="username"
                name="username"
                placeholder="Nom d'utilisateur"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Mot de passe"
                required
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
