import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

const SlotEmoji = ({
  finalEmoji,
  duration,
  interval,
  emojiSet,
}: {
  finalEmoji: string;
  duration: number;
  interval: number;
  emojiSet: string[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(true);

  useEffect(() => {
    // Function to start spinning animation
    const startSpinning = () => {
      setIsSpinning(true);
      const intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % emojiSet.length);
      }, interval);

      setTimeout(() => {
        clearInterval(intervalId);
        setIsSpinning(false);
        setCurrentIndex(emojiSet.indexOf(finalEmoji));
      }, duration);

      return intervalId;
    };

    // Initial spin
    let intervalId = startSpinning();

    // Set up recurring spins every 5 seconds
    const restartInterval = setInterval(() => {
      clearInterval(intervalId);
      intervalId = startSpinning();
    }, 5000);

    // Cleanup function
    return () => {
      clearInterval(intervalId);
      clearInterval(restartInterval);
    };
  }, [emojiSet, finalEmoji, interval, duration]);

  return <span className="inline-block">{emojiSet[currentIndex]}</span>;
};

export default function Home() {
  const moneyEmojis = ["💸", "💰", "💵", "🏦", "💎"];
  const robotEmojis = ["🤖", "🦾", "🔧", "🧠", "⚡"];
  const partyEmojis = ["🎉", "🎊", "✨", "🎯", "🚀"];

  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>CURATE.FUN - Curate News on Socials</title>
        <meta
          name="description"
          content="Curate news directly on socials and turn feeds into regular content."
        />
        <meta
          property="og:title"
          content="CURATE.FUN - Curate News on Socials"
        />
        <meta
          property="og:description"
          content="Curate news directly on socials and turn feeds into regular content."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://curate.press" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="CURATE.FUN - Curate News on Socials"
        />
        <meta
          name="twitter:description"
          content="Curate news directly on socials and turn feeds into regular content."
        />
        <meta
          name="keywords"
          content="curate, news, socials, content, feeds, curate.fun, curate press, cryptogrants wire, potlock"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://curate.press" />
        <meta httpEquiv="content-language" content="en" />
        <meta name="author" content="POTLOCK" />
        <meta name="robots" content="index, follow" />
        <meta property="og:image" content="https://curate.press/curatedotfunbannernew.png" />
        <meta
          property="twitter:image"
          content="https://curate.press/curatedotfunbannernew.png"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen p-4 px-2 sm:px-4">
        <div className="text-center w-full max-w-4xl mx-auto">
          <div
            id="emojis"
            className="text-4xl sm:text-6xl md:text-8xl mb-4 sm:mb-8 space-x-2 sm:space-x-4 md:space-x-8"
          >
            <SlotEmoji
              finalEmoji="💸�"
              duration={2000}
              interval={150}
              emojiSet={["🔖", "📑", "📚", "📌", "📎"]}
            />
            <SlotEmoji
              finalEmoji="�"
              duration={2500}
              interval={100}
              emojiSet={["📷", "🎥", "🎙️", "📹", "📸"]}
            />
            <SlotEmoji
              finalEmoji="🤖"
              duration={3000}
              interval={200}
              emojiSet={["🤖", "🦾", "🔧", "🧠", "⚡"]}
            />
          </div>

          <div className="h-12 sm:h-16 mb-4 sm:mb-8">
            <TypeAnimation
              sequence={[
                "[curate]",
                1000,
                "[curate] news...",
                800,
                "[curate] crowdsourced on socials..",
                1000,
                "[output] blogs",
                800,
                "[output] podcasts",
                800,
                "[output] CONTENT",
                1000,
              ]}
              wrapper="div"
              cursor={true}
              repeat={Infinity}
              className="text-lg sm:text-xl md:text-2xl font-mono px-2"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-2">
            <Link
              href="https://twitter.com/curatedotfun"
              className="btn text-sm sm:text-base w-[calc(50%-0.5rem)] sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </Link>
            <Link
              href="https://docs.curate.press"
              className="btn text-sm sm:text-base w-[calc(50%-0.5rem)] sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/potlock/curatedotfun"
              className="btn text-sm sm:text-base w-[calc(50%-0.5rem)] sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </Link>
            <Link
              href="https://t.me/+UM70lvMnofk3YTVh"
              className="btn text-sm sm:text-base w-[calc(50%-0.5rem)] sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </Link>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 w-full py-2 sm:py-4 text-center bg-white/80 backdrop-blur text-sm sm:text-base">
        <Link
          href="https://potlock.org"
          className="hover:text-gray-800"
          target="_blank"
          rel="noopener noreferrer"
        >
          w/ ❤️ by 🫕 POTLOCK
        </Link>
      </footer>
    </div>
  );
}
