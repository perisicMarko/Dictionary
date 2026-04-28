export default function Loading() {
  return (
    <div className="flex justify-center sm:items-center mt-40 sm:mt-0 w-screen h-screen">
      <div className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] xl:w-[150px] xl:h-[150px] bg-main rounded-2xl morph-loader"></div>
    </div>
  );
}
