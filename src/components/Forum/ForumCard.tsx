
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  created_at: string;
  replies_count: number;
  views: number;
}

interface ForumCardProps {
  post: ForumPost;
  onClick: () => void;
}

export const ForumCard = ({ post, onClick }: ForumCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {post.content}
            </CardDescription>
          </div>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.replies_count} balasan
            </div>
            <span>{post.views} views</span>
          </div>
          <span>
            {formatDistanceToNow(new Date(post.created_at), { 
              addSuffix: true, 
              locale: id 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
