import { MessageCircle, Calendar, Star, FileText, Video, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ProfileModalProps {
  user: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    location: string;
    skillsKnown: string[];
    skillsToLearn: string[];
    trustScore: number;
    totalSessions: number;
    proofs: Array<{ type: string; url: string; skill: string }>;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ user, isOpen, onClose }: ProfileModalProps) => {
  const navigate = useNavigate();

  if (!user) return null;

  const handleConnect = () => {
    toast.success("Connection request sent!");
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const getProofIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "pdf": return <FileText className="h-4 w-4" />;
      default: return <ImageIcon className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-20 w-20 border-2 border-primary/20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{user.name}</DialogTitle>
              <DialogDescription className="text-base">{user.bio}</DialogDescription>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{user.trustScore}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {user.totalSessions} sessions completed
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="space-y-6 py-4">
          <div>
            <h3 className="font-semibold mb-3">Skills Teaching</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsKnown.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Skills Learning</h3>
            <div className="flex flex-wrap gap-2">
              {user.skillsToLearn.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {user.proofs.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Skill Proofs</h3>
              <div className="grid grid-cols-2 gap-3">
                {user.proofs.map((proof, idx) => (
                  <div key={idx} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2">
                      {getProofIcon(proof.type)}
                      <span className="text-sm font-medium">{proof.skill}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{proof.type} proof</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex gap-3 pt-4">
          <Button onClick={handleConnect} className="flex-1">
            Connect
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileModal;
