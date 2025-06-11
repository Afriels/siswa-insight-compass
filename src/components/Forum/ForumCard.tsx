
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface ForumCardProps {
  title: string;
  description: string;
  category: string;
  author: string;
  createdAt: string;
  repliesCount: number;
}

export const ForumCard = ({ 
  title, 
  description, 
  category, 
  author, 
  createdAt, 
  repliesCount 
}: ForumCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {description}
            </CardDescription>
          </div>
          <Badge variant="secondary">{category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {author}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {repliesCount} balasan
            </div>
          </div>
          <span>
            {formatDistanceToNow(new Date(createdAt), { 
              addSuffix: true, 
              locale: id 
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
