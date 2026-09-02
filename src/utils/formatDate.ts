const formatDate = (isoDateString?: string | Date) => {
  if (!isoDateString) return "";

  let date: Date;

  if (isoDateString instanceof Date) {
    date = isoDateString;
  } else {
    let str = isoDateString.trim();
    if (!str.endsWith("Z") && !str.includes("+")) {
      str += "Z";
    }
    date = new Date(str);
  }

  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export default formatDate;
