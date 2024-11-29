import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AccountSkeleton = () => {
  return (
    <div className="w-full max-w-full flex-start flex-col">
      <Skeleton height={80} width={400} />
      <div className="mt-5">
        <Skeleton height={28} width={500} count={2} />
      </div>

      <div className="mt-16 flex-1 break-inside-avoid rounded-lg border border-gray-300 bg-white/20 bg-clip-padding p-6 pb-4 backdrop-blur-lg backdrop-filter md:w-[460px] w-full h-fit">
        <div className="relative w-full flex items-center justify-start gap-6">
          <Skeleton circle height={60} width={60} />
          <Skeleton height={30} width={100} borderRadius={20} />
        </div>
        <div className="mt-8">
          <Skeleton height={45} width="100%" />
        </div>
        <div className="flex-end mx-3 mb-5 mt-10">
          <Skeleton height={30} width={120} borderRadius={20} />
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;
