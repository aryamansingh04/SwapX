import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProofViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const proofUrl = searchParams.get("url") || "";
  const skill = searchParams.get("skill") || "Skill Proof";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{skill} - Proof</CardTitle>
            </CardHeader>
            <CardContent>
              {proofUrl && proofUrl !== "#" ? (
                <div className="w-full" style={{ height: "calc(100vh - 300px)" }}>
                  <iframe
                    src={proofUrl}
                    className="w-full h-full border rounded-lg"
                    title={`${skill} Proof`}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg text-muted-foreground mb-2">
                    No PDF available
                  </p>
                  <p className="text-sm text-muted-foreground">
                    The proof PDF URL is not available or invalid.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProofViewer;

