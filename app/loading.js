import Loader from "../components/utils/Loader";

export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f9f9f9] text-[#030303]">
      <Loader />
      </div>
    
  );
}