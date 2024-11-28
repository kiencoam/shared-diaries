export function calculateTimeAgo(date: Date): string {
  const now = new Date();
  const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsPast < 60) {
    return `${secondsPast} giây trước`;
  } else if (secondsPast < 3600) {
    const minutes = Math.floor(secondsPast / 60);
    return `${minutes} phút trước`;
  } else if (secondsPast < 86400) {
    const hours = Math.floor(secondsPast / 3600);
    return `${hours} giờ trước`;
  } else if (secondsPast < 2592000) {
    // 30 * 24 * 60 * 60
    const days = Math.floor(secondsPast / 86400);
    return `${days} ngày trước`;
  } else if (secondsPast < 31536000) {
    // 365 * 24 * 60 * 60
    const months = Math.floor(secondsPast / 2592000);
    return `${months} tháng trước`;
  } else {
    const years = Math.floor(secondsPast / 31536000);
    return `${years} năm trước`;
  }
}
