import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Video, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const ProofUpload = () => {
  const navigate = useNavigate();
  const [proofType, setProofType] = useState<"video" | "pdf" | "image">("video");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Proof uploaded successfully!");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  const getIcon = () => {
    switch (proofType) {
      case "video": return <Video className="h-8 w-8" />;
      case "pdf": return <FileText className="h-8 w-8" />;
      case "image": return <ImageIcon className="h-8 w-8" />;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Upload Skill Proof</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="skill">Skill Name</Label>
                <Input
                  id="skill"
                  placeholder="e.g., React, Python, UI Design"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-3">
                <Label>Proof Type</Label>
                <RadioGroup
                  value={proofType}
                  onValueChange={(v) => setProofType(v as "video" | "pdf" | "image")}
                  aria-label="Proof type selection"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="video" id="video" />
                    <Label htmlFor="video" className="flex-1 cursor-pointer flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      <span>Video Demo</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <Label htmlFor="pdf" className="flex-1 cursor-pointer flex items-center gap-2">
                      <FileText className="h-4 w-4 text-secondary" />
                      <span>PDF Document</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <RadioGroupItem value="image" id="image" />
                    <Label htmlFor="image" className="flex-1 cursor-pointer flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-accent" />
                      <span>Image/Screenshot</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label>Upload File</Label>
                <div className="border-2 border-dashed rounded-lg p-8 hover:bg-muted/50 transition-colors">
                  {selectedFile ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIcon()}
                        <div>
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedFile(null)}
                        aria-label="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 cursor-pointer">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileSelect}
                        accept={
                          proofType === "video" ? "video/*" :
                          proofType === "pdf" ? ".pdf" :
                          "image/*"
                        }
                        aria-label="File upload"
                      />
                    </label>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!selectedFile}>
                Upload Proof
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProofUpload;

