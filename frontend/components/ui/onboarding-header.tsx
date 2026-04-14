type Props = {
  stepNumber: number;
  titleText: string;
  titleTextAccent: string | null;
  caption: string;
};

export default function OnboardingHeader({
  stepNumber,
  titleText,
  titleTextAccent,
  caption,
}: Props) {
  return (
    <div className="w-full flex justify-center">
      <div className="text-center flex flex-col gap-4 py-12 max-w-3xl ">
        <div className="flex flex-col items-center gap-4 justify-center">
          <span className="z-10 shrink-0 rounded-full bg-white ring-2 ring-indigo-600 text-indigo-600 dark:ring-indigo-500 dark:text-indigo-500 dark:bg-zinc-950 w-8 h-8 flex items-center justify-center text-xl font-semibold">
            {stepNumber}
          </span>{" "}
          <p className="text-4xl font-semibold text-gray-800 dark:text-gray-100">
            {titleText}
            {titleTextAccent && (
              <span className="text-indigo-600 dark:text-indigo-500">
                {" "}
                {titleTextAccent}
              </span>
            )}
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-300">{caption}</p>
      </div>
    </div>
  );
}
