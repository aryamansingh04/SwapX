import Layout from "@/components/Layout";
import { Newspaper } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const News = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">News & Blogs</h1>
          <p className="text-muted-foreground">Stay updated with the latest articles and insights</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" />
              Latest Articles
            </CardTitle>
            <CardDescription>
              Read articles, blog posts, and news about skill exchange and learning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Newspaper className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>No articles available yet. Check back soon for updates!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default News;

