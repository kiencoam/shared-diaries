import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AvatarNavSkeleton = () => {
  return (
    <div className="flex-center gap-3">
      <Skeleton width={120} height={30} borderRadius={20} />
      <Skeleton circle={true} height={37} width={37} />
    </div>
  );
};

export default AvatarNavSkeleton;
