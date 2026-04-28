import Image from "next/image";

export function Help({
  toggleHelp,
  help,
}: {
  toggleHelp: () => void;
  help: boolean;
}) {
  return (
    <div
      key="help"
      className="w-3/4 sm:w-[500px] md:w-[600px] xl:w-[700px] xl:h-[400px] rounded-4xl mt-15 xl:mt-30 p-3 flex flex-col items-center enter-fade"
      id="help"
    >
      <h2
        className="hover:underline mb-5 cursor-pointer bg-main text-box py-2 text-center w-full rounded-3xl enter-fade-up enter-delay-1"
        onClick={() => toggleHelp()}
      >
        {help ? "Go back" : "Need hlep?"}
      </h2>
      <div className="center-vertically enter-fade-up enter-delay-1">
        <Image
          className="block rounded-4xl"
          width={350}
          height={280}
          src="/wordInput.png"
          alt="Picture of word input"
          priority
        />
        <p className="bg-main text-box rounded-2xl p-3 mt-3 w-full enter-fade-up enter-delay-1">
          Input the word you would like to remember, then click the
          &quot;Generate&quot; button.
        </p>
      </div>
      <div className="mt-5 center-vertically enter-fade-up enter-delay-1">
        <Image
          className="block rounded-4xl"
          width={350}
          height={500}
          src="/generateNotes.png"
          alt="Generate notes"
          priority
        />
        <p className="block bg-main text-box rounded-3xl p-3 mt-3 w-full text-center enter-fade-up enter-delay-1">
          Pronunciation of word and two text areas will pop up: one filled with
          generated notes from the app and an empty one reserved for your
          personal notes.
        </p>
      </div>
    </div>
  );
}
