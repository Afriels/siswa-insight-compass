
import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Dummy data untuk sosiogram
const nodes = [
  { id: 1, name: "Ahmad", radius: 25, color: "#3b82f6" },
  { id: 2, name: "Budi", radius: 25, color: "#3b82f6" },
  { id: 3, name: "Cindy", radius: 25, color: "#3b82f6" },
  { id: 4, name: "Dewi", radius: 25, color: "#3b82f6" },
  { id: 5, name: "Eko", radius: 25, color: "#3b82f6" },
  { id: 6, name: "Fira", radius: 25, color: "#3b82f6" },
  { id: 7, name: "Gita", radius: 25, color: "#3b82f6" },
];

const links = [
  { source: 0, target: 1, value: 3 },
  { source: 0, target: 2, value: 2 },
  { source: 1, target: 3, value: 2 },
  { source: 2, target: 3, value: 1 },
  { source: 3, target: 4, value: 3 },
  { source: 4, target: 5, value: 2 },
  { source: 5, target: 6, value: 1 },
  { source: 1, target: 6, value: 1 },
];

export function SociogramChart() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    // Resize canvas to fit container
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      
      canvas.width = parent.clientWidth;
      canvas.height = 500; // Fixed height
      
      drawSociogram(context, canvas.width, canvas.height);
    };

    // Initial resize
    resize();
    
    // Re-draw on window resize
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  // Draw the sociogram
  const drawSociogram = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    // Create node positions (simplified force layout)
    const nodePositions = nodes.map((_, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = Math.min(width, height) * 0.35;
      
      return {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle)
      };
    });
    
    // Draw links
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    
    links.forEach(link => {
      const source = nodePositions[link.source];
      const target = nodePositions[link.target];
      
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      
      // Draw arrow
      const angle = Math.atan2(target.y - source.y, target.x - source.x);
      const arrowLength = 10;
      
      ctx.beginPath();
      ctx.moveTo(target.x, target.y);
      ctx.lineTo(
        target.x - arrowLength * Math.cos(angle - Math.PI / 6),
        target.y - arrowLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(target.x, target.y);
      ctx.lineTo(
        target.x - arrowLength * Math.cos(angle + Math.PI / 6),
        target.y - arrowLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    });
    
    // Draw nodes
    nodes.forEach((node, i) => {
      const { x, y } = nodePositions[i];
      
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, node.radius, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Text
      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.name, x, y);
    });
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Sosiogram Kelas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[500px] relative">
          <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
