"use client";
import Image from "next/image";

export function Landing() {
  return (
    <div className="bg-[#FDF8F4] min-h-screen">
      {/* Hero Section */}
      <header className="text-center py-12">
        <span className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
          #1 RANKED AI HEADSHOT COMPANY
        </span>
        <h1 className="text-4xl font-bold mt-4 text-gray-900">
          The Leading AI Headshot Generator for
          <span className="text-orange-600"> Professionals</span>
        </h1>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          Turn your selfies into studio-quality headshots in minutes. Save
          hundreds of dollars and hours of your time.
        </p>
        <button className="mt-6 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600">
          Create your headshots now →
        </button>
      </header>

      {/* Image Showcase */}
      <section className="flex justify-center gap-4 px-6 overflow-x-auto py-6">
        {Array(7)
          .fill(0)
          .map((_, index) => (
            <div key={index} className="relative w-40 h-48">
              <Image
                src={`/images/sample${index + 1}.jpg`}
                alt="AI Generated Headshot"
                layout="fill"
                className="rounded-lg object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-white px-2 py-1 text-xs font-semibold rounded-md">
                AI Generated by Aragon
              </span>
            </div>
          ))}
      </section>

      {/* Trust Section */}
      <section className="text-center py-10">
        <p className="text-gray-700 font-semibold">
          Trusted by over <span className="text-orange-600">1,000,000</span> professionals and teams.
          <br /> 25,000,000+ headshots generated to date.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          <Image src="/logos/pwc.png" alt="pwc" width={80} height={40} />
          <Image src="/logos/asu.png" alt="ASU" width={80} height={40} />
          <Image src="/logos/redfin.png" alt="Redfin" width={80} height={40} />
          <Image src="/logos/nyu.png" alt="NYU" width={80} height={40} />
        </div>
      </section>
    </div>
  );
}
