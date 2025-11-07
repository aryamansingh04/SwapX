import Layout from "@/components/Layout";
import { Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Reels = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Reels</h1>
          <p className="text-muted-foreground">Watch and share skill exchange reels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Reels Coming Soon
            </CardTitle>
            <CardDescription>
              This section will feature short-form video content showcasing skills and learning experiences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Reels feature is under development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reels;

