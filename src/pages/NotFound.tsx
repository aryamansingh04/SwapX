import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[image:var(--gradient-soft)]">
      <Card className="max-w-md w-full mx-4">
        <CardContent className="pt-6 text-center">
          <h1 className="mb-4 text-6xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            404
          </h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <p className="mb-6 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button onClick={() => navigate("/home")} className="w-full">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
