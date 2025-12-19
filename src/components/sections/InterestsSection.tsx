import { useState } from 'react';
import { Interest } from '@/types';

const interests: Interest[] = [
  {
    id: '1',
    title: '手工',
    image: 'https://miaoda-site-img.cdn.bcebos.com/images/baidu_image_search_0812e314-9288-4db8-af59-6ffd92206b00.jpg',
    note: '用双手创造温暖的作品，每一件手工都承载着心意和时光。',
    rotation: -3,
  },
  {
    id: '2',
    title: '阅读',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
    note: '书籍是最好的朋友，每一本书都打开一个新世界。',
    rotation: 2,
  },
  {
    id: '3',
    title: '咖啡',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80',
    note: '一杯好咖啡，能让整个下午都变得美好。',
    rotation: -2,
  },
  {
    id: '4',
    title: '旅行',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    note: '世界那么大，我想去看看。每一次旅行都是一次成长。',
    rotation: 3,
  },
  {
    id: '5',
    title: '音乐',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    note: '音乐是情绪的出口，也是灵感的源泉。',
    rotation: -1,
  },
  {
    id: '6',
    title: '烹饪',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&q=80',
    note: '做饭是一种创作，也是一种享受生活的方式。',
    rotation: 2,
  },
];

export default function InterestsSection() {
  const [flippedId, setFlippedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen py-20 px-4 fade-in">
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-5xl max-xl:text-4xl font-handwriting text-foreground mb-4">
            我的兴趣
          </h2>
          <div className="divider-handdrawn w-32 mx-auto mb-6" />
          <p className="text-2xl font-handwriting text-foreground/70 mb-4">
            当屏幕暗下来，这些小事替我发光。
          </p>
          <p className="text-base font-serif text-foreground/60">
            点击照片查看背后的故事 ✨
          </p>
        </div>

        {/* Polaroid相框网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 max-xl:gap-8">
          {interests.map((interest, index) => (
            <div
              key={interest.id}
              className="flex justify-center fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className="relative cursor-pointer"
                style={{
                  perspective: '1000px',
                }}
                onClick={() => setFlippedId(flippedId === interest.id ? null : interest.id)}
              >
                <div
                  className="relative transition-transform duration-700"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedId === interest.id ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* 正面 - 照片 */}
                  <div
                    className="polaroid-frame"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotate(${interest.rotation}deg)`,
                    }}
                  >
                    <img
                      src={interest.image}
                      alt={interest.title}
                      className="w-64 h-64 object-cover max-xl:w-56 max-xl:h-56"
                    />
                    <p className="text-center font-handwriting text-xl text-gray-800 mt-4">
                      {interest.title}
                    </p>
                  </div>

                  {/* 背面 - 注释 */}
                  <div
                    className="absolute inset-0 polaroid-frame flex items-center justify-center p-8"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: `rotateY(180deg) rotate(${interest.rotation}deg)`,
                    }}
                  >
                    <div className="text-center">
                      <p className="font-serif text-gray-800 leading-relaxed">
                        {interest.note}
                      </p>
                      <p className="mt-4 text-sm text-gray-500 font-handwriting">
                        — {interest.title}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 提示文字 */}
        <div className="mt-16 text-center">
          <p className="font-serif text-foreground/60 text-sm">
            这些兴趣让我的生活更加丰富多彩 🌈
          </p>
        </div>
      </div>
    </div>
  );
}
