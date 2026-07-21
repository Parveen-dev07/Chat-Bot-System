// Returns "9:41 AM" style time from a date string
export const formatMessageTime = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Returns "Today", "Yesterday", or "15 July" style label
export const formatDateLabel = (dateStr: string): string => {
  const msgDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(msgDate, today)) return "Today";
  if (isSameDay(msgDate, yesterday)) return "Yesterday";

  return msgDate.toLocaleDateString([], { day: "numeric", month: "long" });
};

// Groups messages by date label — returns array of { label, messages[] }
export const groupMessagesByDate = (messages: any[]) => {
  const groups: { label: string; messages: any[] }[] = [];

  messages.forEach((msg) => {
    const label = formatDateLabel(msg.createdAt);
    const existing = groups.find((g) => g.label === label);
    if (existing) {
      existing.messages.push(msg);
    } else {
      groups.push({ label, messages: [msg] });
    }
  });

  return groups;
};
