import Image from "next/image";
import Link from "next/link";
import type { BlogBadgeIcon, BlogPost } from "@/data/blogIndexPage";

const badgeIcons: Record<BlogBadgeIcon, { src: string; width: number; height: number }> = {
  rocket: { src: "/assets/images/blog/icon-rocket.svg", width: 20, height: 20 },
  fire: { src: "/assets/images/blog/icon-fire.svg", width: 16, height: 20 },
  medal: { src: "/assets/images/blog/icon-medal.svg", width: 20, height: 20 },
  smile: { src: "/assets/images/blog/icon-smile.svg", width: 16, height: 16 },
  timer: { src: "/assets/images/blog/icon-timer.svg", width: 18, height: 20 },
};

export function BlogCard({ post }: { post: BlogPost }) {
  const icon = post.badgeIcon ? badgeIcons[post.badgeIcon] : null;

  return (
    <article className="w-full">
      <Link href={post.href} className="group flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#eef2f8]">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 330px, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {post.badge && icon ? (
            <span className="absolute top-3 right-3 inline-flex h-10 items-center gap-1 rounded-full bg-white px-4">
              <img
                src={icon.src}
                alt=""
                width={icon.width}
                height={icon.height}
                className="shrink-0"
              />
              <span className="font-satoshi text-[12px] leading-4 font-medium tracking-[-0.26px] text-black uppercase">
                {post.badge}
              </span>
            </span>
          ) : null}
        </div>
        <div className="flex max-w-[296px] flex-col gap-3">
          <p className="font-satoshi text-[12px] leading-[1.2] font-medium tracking-[-0.5px] lg:text-[14px]">
            <span className="text-black/50">{post.date}</span>
            <span className="text-black/70">{` • ${post.category}`}</span>
          </p>
          <h3 className="font-figtree text-[20px] leading-[1.2] font-normal tracking-[-1.2px] text-black lg:text-[24px] lg:tracking-[-1.51px]">
            {post.title}
          </h3>
        </div>
      </Link>
    </article>
  );
}
