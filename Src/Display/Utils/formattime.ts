export default function formatTime(uptime: number): string {
  const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
  const hours = Math.floor((uptime / (60 * 60 * 1000)) % 24);
  const minutes = Math.floor((uptime / (60 * 1000)) % 60);
  const seconds = Math.floor((uptime / 1000) % 60);

  const formattedDays = days > 0 ? `${days}d ` : '';
  const formattedHours = hours > 0 ? `${hours.toString().padStart(2, '0')}:` : '';
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');

  return `${formattedDays}${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}
