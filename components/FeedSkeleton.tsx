import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FeedSkeleton = ({ cards }: { cards: number }) => {
  return (
    <div className="prompt_layout">
      {Array(cards)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="prompt_card">
            <div className="flex-1 flex justify-start items-center gap-3">
              <Skeleton circle={true} height={40} width={40} />
              <div className="flex flex-col">
                <Skeleton width={100} height={20} />
                <Skeleton width={50} height={15} />
              </div>
            </div>
            <div className="my-4">
              <Skeleton count={5} />
            </div>
            <Skeleton width={50} height={15} />
          </div>
        ))}
    </div>
  );
};

export default FeedSkeleton;
