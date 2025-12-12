import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paintbrush, Eraser, Trash2, Download } from 'lucide-react';

interface DrawingBoardProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}

export default function DrawingBoard({ onSave, onClear }: DrawingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布背景为白色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? lineWidth * 3 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  const colors = [
    '#000000', // 黑色
    '#FF0000', // 红色
    '#00FF00', // 绿色
    '#0000FF', // 蓝色
    '#FFFF00', // 黄色
    '#FF00FF', // 紫色
    '#00FFFF', // 青色
    '#FFA500', // 橙色
  ];

  return (
    <div className="space-y-4">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-4">
        {/* 工具选择 */}
        <div className="flex gap-2">
          <Button
            type="button"
            variant={tool === 'pen' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('pen')}
            className="gap-2"
          >
            <Paintbrush className="w-4 h-4" />
            画笔
          </Button>
          <Button
            type="button"
            variant={tool === 'eraser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTool('eraser')}
            className="gap-2"
          >
            <Eraser className="w-4 h-4" />
            橡皮擦
          </Button>
        </div>

        {/* 颜色选择 */}
        {tool === 'pen' && (
          <div className="flex items-center gap-2">
            <Label className="text-sm">颜色：</Label>
            <div className="flex gap-1">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                    color === c ? 'border-foreground scale-110' : 'border-border'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`选择颜色 ${c}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* 粗细选择 */}
        <div className="flex items-center gap-2">
          <Label htmlFor="lineWidth" className="text-sm">
            粗细：
          </Label>
          <input
            id="lineWidth"
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-24"
          />
          <span className="text-sm w-8">{lineWidth}px</span>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearCanvas}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            清空
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={saveDrawing}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            保存画作
          </Button>
        </div>
      </div>

      {/* 画布 */}
      <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="cursor-crosshair w-full"
          style={{ touchAction: 'none' }}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        💡 提示：在画布上绘制您想要的图案，完成后点击"保存画作"按钮
      </p>
    </div>
  );
}
