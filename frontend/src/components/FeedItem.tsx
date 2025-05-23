import { HiChevronDown, HiChevronUp, HiExternalLink } from "react-icons/hi";
import {
  FeedStatus,
  SubmissionStatus,
  SubmissionWithFeedData,
} from "../types/twitter";
import { getTweetUrl, handleApprove, handleReject } from "../lib/twitter";
import { useBotId } from "../lib/config";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { formatDate } from "../utils/datetime";

// Reusable Components
const UserLink = ({ username }: { username: string }) => (
  <a
    href={`https://x.com/${username}`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-800 hover:text-gray-600 font-medium transition-colors"
  >
    @{username}
  </a>
);

const TweetLink = ({
  tweetId,
  username,
  title,
}: {
  tweetId: string;
  username: string;
  title: string;
}) => (
  <a
    href={getTweetUrl(tweetId, username)}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-600 hover:text-gray-800 transition-colors"
    title={title}
  >
    <HiExternalLink className="inline h-4 w-4" />
  </a>
);

const StatusBadge = ({
  status,
  feedId,
  feedName,
  clickable = false,
}: {
  status: SubmissionWithFeedData["status"];
  feedId?: string;
  feedName?: string;
  clickable?: boolean;
}) => {
  const baseClasses = "status-badge px-2 py-1 rounded-md text-sm font-medium";
  const statusClasses = {
    pending: "bg-yellow-200 text-black",
    approved: "bg-green-200 text-black",
    rejected: "bg-red-200 text-black",
  };
  const classes = `${baseClasses} ${statusClasses[status]} ${clickable ? "cursor-pointer hover:opacity-80" : ""}`;

  if (feedId) {
    return (
      <Link
        to="/feed/$feedId"
        params={{ feedId }}
        className={classes}
        title={feedName}
      >
        {status}
      </Link>
    );
  }

  return <span className={classes}>{status}</span>;
};

// Feed Status Badges component
const FeedStatusBadges = ({
  feedStatuses,
  statusFilter,
}: {
  feedStatuses?: FeedStatus[];
  statusFilter: "all" | SubmissionStatus;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!feedStatuses || feedStatuses.length === 0) {
    return null;
  }

  // Filter statuses based on statusFilter
  const filteredStatuses =
    statusFilter === "all"
      ? feedStatuses
      : feedStatuses.filter((fs) => fs.status === statusFilter);

  if (filteredStatuses.length === 0) {
    return null;
  }

  // Show only 1 badge on mobile/tablet, up to 3 on desktop
  const maxVisibleBadges = {
    mobile: 1,
    desktop: 3,
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1">
        {/* Mobile view - show only 1 badge */}
        <div className="md:hidden">
          {filteredStatuses.slice(0, maxVisibleBadges.mobile).map((fs) => (
            <StatusBadge
              key={fs.feedId}
              status={fs.status}
              feedId={fs.feedId}
              feedName={fs.feedName}
              clickable
            />
          ))}

          {filteredStatuses.length > maxVisibleBadges.mobile && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-200 text-black flex items-center"
            >
              +{filteredStatuses.length - maxVisibleBadges.mobile} more
              {isExpanded ? (
                <HiChevronUp className="ml-1" />
              ) : (
                <HiChevronDown className="ml-1" />
              )}
            </button>
          )}
        </div>

        {/* Desktop view - show up to 3 badges */}
        <div className="hidden md:flex md:flex-wrap md:gap-1">
          {filteredStatuses.slice(0, maxVisibleBadges.desktop).map((fs) => (
            <StatusBadge
              key={fs.feedId}
              status={fs.status}
              feedId={fs.feedId}
              feedName={fs.feedName}
              clickable
            />
          ))}

          {filteredStatuses.length > maxVisibleBadges.desktop && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-2 py-1 rounded-md text-sm font-medium bg-gray-200 text-black flex items-center"
            >
              +{filteredStatuses.length - maxVisibleBadges.desktop} more
              {isExpanded ? (
                <HiChevronUp className="ml-1" />
              ) : (
                <HiChevronDown className="ml-1" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Popover for expanded view */}
      {isExpanded && (
        <div
          ref={popoverRef}
          className="absolute top-full left-0 mt-1 p-2 bg-white border-2 border-black shadow-sharp rounded-md z-10 min-w-[200px]"
        >
          <h4 className="font-medium mb-2">All Feeds</h4>
          <div className="space-y-2">
            {filteredStatuses.map((fs) => (
              <div
                key={fs.feedId}
                className="flex justify-between items-center"
              >
                <span className="text-sm">{fs.feedName}</span>
                <StatusBadge status={fs.status} feedId={fs.feedId} clickable />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const NotesSection = ({
  title,
  username,
  tweetId,
  note,
  className = "",
}: {
  title: string;
  username: string;
  tweetId: string;
  note: string | null;
  className?: string;
}) => {
  // Change title based on whether there are notes or not
  const displayTitle = note
    ? title
    : title === "Moderation Notes"
      ? "Moderated"
      : "Curated";

  return (
    <div
      className={`p-4 border-2 border-gray-200 rounded-md bg-gray-50 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h4 className="heading-3">{displayTitle}</h4>
        <span className="text-gray-400">·</span>
        <div className="text-gray-600 break-words">
          by <UserLink username={username} />
          <span className="text-gray-400 mx-1">·</span>
          <TweetLink
            tweetId={tweetId}
            username={username}
            title={`View ${title.toLowerCase()} on X/Twitter`}
          />
        </div>
      </div>
      {note && <p className="body-text text-gray-700">{note}</p>}
    </div>
  );
};

const ModerationActions = ({
  submission,
}: {
  submission: SubmissionWithFeedData;
}) => {
  const botId = useBotId();

  return (
    <div className="flex justify-center flex-col gap-2">
      <Button onClick={() => handleApprove(submission, botId)}>Approve</Button>
      <Button
        onClick={() => handleReject(submission, botId)}
        variant="destructive"
      >
        Reject
      </Button>
    </div>
  );
};

interface FeedItemProps {
  submission: SubmissionWithFeedData;
  statusFilter: "all" | SubmissionStatus;
}

// Function to truncate text to a specific character count without breaking words
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;

  // Find the last space before the maxLength
  const lastSpace = text.lastIndexOf(" ", maxLength);

  // If no space found, just cut at maxLength
  if (lastSpace === -1) return text.substring(0, maxLength) + "...";

  // Otherwise cut at the last space
  return text.substring(0, lastSpace) + "...";
};

export const FeedItem = ({ submission }: FeedItemProps) => {
  const lastModeration =
    submission.moderationHistory?.[submission.moderationHistory.length - 1];

  return (
    <div
      className="flex gap-3 flex-col p-4 w-full items-center justify-between border rounded-lg border-neutral-300"
      id={submission.tweetId}
    >
      <div className="flex flex-col gap-3 w-full justify-between items-center">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center justify-center gap-2">
            <div>
              <p className="text-[--card-foreground] text-nowrap text-base font-semibold leading-4">
                Web3Plug (murica/acc)
              </p>
              <p>@{submission.username}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="7"
                height="6"
                viewBox="0 0 7 6"
                fill="none"
              >
                <circle cx="3.28564" cy="3" r="3" fill="#D9D9D9" />
              </svg>
              <span className="text-gray-600 mt-1">
                {formatDate(submission.createdAt)}
              </span>
            </div>
          </div>
          <div>
            <Badge variant={submission.status}>{submission.status}</Badge>
          </div>
        </div>
        <div className="w-full overflow-hidden">
          <p className="text-base font-semibold leading-6">
            EP 4. Arbitrum DAO's 7,500 ETH Allocation Faces Mixed Reactions Over
            Non-Native Project
          </p>
        </div>
      </div>
      {/* Title Section */}

      {/* Content Section */}
      <div className="w-full overflow-hidden">
        <p className="text-sm text-[#666]  leading-6 font-normal overflow-hidden text-ellipsis">
          {truncateText(submission.content, 240)}
        </p>
      </div>

      {/* Notes Section */}
      <div className="mt-6 w-full">
        {/* Moderation Notes */}
        {(submission.status === "approved" ||
          submission.status === "rejected") &&
          lastModeration && (
            <div className="flex">
              <div className="flex-col flex-grow">
                <NotesSection
                  title="Moderation Notes"
                  username={lastModeration.adminId}
                  tweetId={submission.moderationResponseTweetId!}
                  note={lastModeration.note}
                  // className="mb-4"
                />
              </div>
            </div>
          )}

        {/* Curator Notes and Moderation Actions */}
        {submission.status === "pending" && (
          <div className="flex items-center gap-8">
            <div className="flex-col flex-grow">
              <NotesSection
                title="Curator's Notes"
                username={submission.curatorUsername}
                tweetId={submission.curatorTweetId}
                note={submission.curatorNotes}
              />
            </div>
            <div className="flex-col">
              <div className="flex">
                <ModerationActions submission={submission} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedItem;
