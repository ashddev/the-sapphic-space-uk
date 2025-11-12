import Link from "next/link";

export default function VideoBanner() {
  return (
    <section className="relaive h-[95dvh]">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 -z-5 h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="relative flex h-full flex-col items-center justify-center gap-6 text-center">
        <h1 className="animate-fadeIn text-5xl font-bold text-white drop-shadow-lg">
          Welcome to The Sapphic Space
        </h1>

        <Link
          href={"https://www.outsavvy.com/organiser/the-sapphic-space"}
          target={"_blank"}
          className="animate-fadeInDelayed cursor-pointer rounded-xl bg-pink-300 px-8 py-3 text-lg font-semibold text-black shadow-lg transition hover:text-white"
        >
          Buy Tickets
        </Link>
      </div>
    </section>
  );
}
