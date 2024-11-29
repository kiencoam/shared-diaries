import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FormSkeleton = () => {
  return (
    <div className="w-full max-w-full flex-start flex-col">
      <Skeleton height={80} width={400} />
      <div className="mt-5">
        <Skeleton height={28} width={500} count={2} />
      </div>

      <div className="mt-10 w-full max-w-2xl flex flex-col gap-3 glassmorphism">
        <Skeleton height={20} width={70} />
        <Skeleton height={200} width="100%" />
        <Skeleton height={20} width={30} />
        <Skeleton height={45} width="100%" />
        <div className="flex-end mx-3 mb-5 gap-4">
          <Skeleton height={30} width={100} />
          <Skeleton height={30} width={100} />
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
