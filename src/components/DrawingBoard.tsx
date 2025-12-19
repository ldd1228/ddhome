import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Paintbrush, Eraser, Trash2, Download, Maximize2, Minimize2, X } from 'lucide-react';

interface DrawingBoardProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}

export default function DrawingBoard({ onSave, onClear }: DrawingBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isInitializedRef = useRef(false);

  // 初始化画布（只执行一次）
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布背景为白色
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    isInitializedRef.current = true;
  }, []);

  // 同步画布内容
  useEffect(() => {
    if (!isFullscreen) return;

    const normalCanvas = canvasRef.current;
    const fullCanvas = fullscreenCanvasRef.current;
    
    if (!normalCanvas || !fullCanvas) return;

    // 将普通画布的内容复制到全屏画布
    const ctx = fullCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(normalCanvas, 0, 0);
  }, [isFullscreen]);

  // 进入全屏
  const enterFullscreen = () => {
    setIsFullscreen(true);
    // 禁止页面滚动
    document.body.style.overflow = 'hidden';
  };

  // 退出全屏
  const exitFullscreen = () => {
    // 将全屏画布的内容复制回普通画布
    const normalCanvas = canvasRef.current;
    const fullCanvas = fullscreenCanvasRef.current;
    
    if (normalCanvas && fullCanvas) {
      const ctx = normalCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(fullCanvas, 0, 0);
      }
    }

    setIsFullscreen(false);
    // 恢复页面滚动
    document.body.style.overflow = '';
  };

  // 组件卸载时恢复页面滚动
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // 获取当前活动的画布
  const getActiveCanvas = () => {
    return isFullscreen ? fullscreenCanvasRef.current : canvasRef.current;
  };

  // 获取坐标（支持鼠标和触摸）
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // 触摸事件
      if (e.touches.length === 0) return { x: 0, y: 0 };
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 鼠标事件
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return;

    const { x, y } = getCoordinates(e);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = e.currentTarget as HTMLCanvasElement;
    if (!canvas) return;

    const { x, y } = getCoordinates(e);

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
    const canvas = getActiveCanvas();
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  const saveDrawing = () => {
    const canvas = getActiveCanvas();
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
    <>
      {/* 普通模式 */}
      <div className={`space-y-4 ${isFullscreen ? 'hidden' : ''}`} ref={containerRef}>
        {/* 工具栏 */}
        <div className="space-y-3">
          {/* 第一行：工具选择和全屏按钮 */}
          <div className="flex flex-wrap items-center gap-2">
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={enterFullscreen}
              className="gap-2 ml-auto"
            >
              <Maximize2 className="w-4 h-4" />
              全屏
            </Button>
          </div>

          {/* 第二行：颜色选择（仅画笔模式） */}
          {tool === 'pen' && (
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm">颜色：</Label>
              <div className="flex flex-wrap gap-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
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

          {/* 第三行：粗细和操作按钮 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="lineWidth" className="text-sm whitespace-nowrap">
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
              <span className="text-sm w-10">{lineWidth}px</span>
            </div>

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
                保存
              </Button>
            </div>
          </div>
        </div>

        {/* 画布 */}
        <div className="border-2 border-dashed border-border rounded-lg overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            width={1200}
            height={600}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="cursor-crosshair w-full touch-none"
            style={{ touchAction: 'none' }}
          />
        </div>

        <p className="text-sm text-muted-foreground">
          💡 提示：在画布上绘制您想要的图案，完成后点击"保存"按钮。点击"全屏"可以放大画布。
        </p>
      </div>

      {/* 全屏模式 */}
      {isFullscreen && (
        <div
          ref={fullscreenRef}
          className="fixed inset-0 z-50 bg-white flex flex-col"
          style={{ touchAction: 'none' }}
        >
          {/* 顶部工具栏 - 仅显示关闭和保存按钮 */}
          <div className="flex items-center justify-between p-3 border-b border-border bg-background/95 backdrop-blur">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={exitFullscreen}
              className="gap-2"
            >
              <Minimize2 className="w-4 h-4" />
              退出全屏
            </Button>
            <div className="flex gap-2">
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
                onClick={() => {
                  saveDrawing();
                  exitFullscreen();
                }}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                保存
              </Button>
            </div>
          </div>

          {/* 画布区域 - 占据剩余空间 */}
          <div className="flex-1 bg-white overflow-hidden flex items-center justify-center p-4">
            <canvas
              ref={fullscreenCanvasRef}
              width={1200}
              height={600}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair touch-none max-w-full max-h-full"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* 底部工具栏 - 画笔、颜色、粗细 */}
          <div className="p-4 border-t border-border bg-background/95 backdrop-blur space-y-3">
            {/* 工具选择 */}
            <div className="flex items-center justify-center gap-2">
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

            {/* 颜色选择（仅画笔模式） */}
            {tool === 'pen' && (
              <div className="flex items-center justify-center gap-2">
                <Label className="text-sm whitespace-nowrap">颜色：</Label>
                <div className="flex gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`w-10 h-10 rounded-full border-2 transition-transform active:scale-95 ${
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

            {/* 粗细调节 */}
            <div className="flex items-center justify-center gap-3">
              <Label htmlFor="lineWidth-fullscreen" className="text-sm whitespace-nowrap">
                粗细：
              </Label>
              <input
                id="lineWidth-fullscreen"
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(Number(e.target.value))}
                className="flex-1 max-w-xs"
              />
              <span className="text-sm w-12 text-center">{lineWidth}px</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
