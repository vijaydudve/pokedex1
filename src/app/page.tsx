import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-screen-xl min-h-screen mx-auto h-full px-8 py-16 md:px-16 md:py-0 bg-primary flex items-center justify-center">
      <Link href='/pokemon' className="text-[25px]"> Click Here To Browse Pokemons</Link>
    </main>
  );
}