export const getFormattedPrice = (price) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return formatter.format(price);
};

function getDateSuffix(x) {
  if (x > 3 && x < 21) return "th";
  switch (x % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export const getFormattedDate = (
  date,
  includeTime = false,
  includeSuffix = false
) => {
  if (typeof date === "string") date = new Date(date);

  const dateTimeOptions = {
    month: "short",
    day: "numeric",
  };

  if (includeTime) {
    dateTimeOptions.year = "numeric";
    dateTimeOptions.hour = "numeric";
    dateTimeOptions.minute = "numeric";

    return new Intl.DateTimeFormat("en-US", dateTimeOptions).format(date);
  }

  const formatter = new Intl.DateTimeFormat("en-US", dateTimeOptions);
  const formatted = formatter.formatToParts(date);

  const day = formatted[2].value;

  return (
    formatted[0].value +
    " " +
    formatted[2].value +
    (includeSuffix ? getDateSuffix(day) : "")
  );
};

export const getFormattedDateMonthAndYear = (value) => {
  const date = new Date(value);
  const day = date.toLocaleString("default", { day: "2-digit" });
  const month = date.toLocaleString("default", { month: "2-digit" });
  const year = date.toLocaleString("default", { year: "numeric" });
  return day + "." + month + "." + year;
};

export const getFormattedRemainTime = (value) => {
  const date = parseInt(value / 86400);
  value = value % 86400;
  const hour = parseInt(value / 3600);
  value = value % 3600;
  const minute = parseInt(value / 60);
  let result = "";
  if (date) result += date + "D" + " ";
  if (hour) result += hour + "H" + " ";
  if (minute) result += minute + "M";

  return result;
};

/**
 *
 * @param num
 * @param currencyType 0: niox format, 1: usd format
 * @returns
 */
export const getFormattedNumber = (num, currencyType = null) => {
  const formatter = new Intl.NumberFormat("en-US");

  return (
    (1 === currencyType ? "$" : "") +
    formatter.format(num) +
    (0 == currencyType ? " NIOX" : "")
  );
};

export const getUnformattedNumber = (num) => {
  if (!num) return 0;
  return num.replace(/,/g, "");
};

export const formatAddress = (account) => {
  if (!account) return "";
  const first = account.substring(0, 6);
  const last = account.substring(account.length - 4);
  return `${first}...${last}`;
};

export const getFormattedTime = (timestamp) => {
  const date = new Date(parseInt(timestamp) * 1000);
  return date.toLocaleString([], {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const getFormattedMonthAndDate = (timestamp, type = 1) => {
  let date = parseInt(timestamp / 86400);

  if (type === 1) {
    const currentDate = parseInt(Date.now() / 86400000);
    if (currentDate == date) return "Today";
    if (currentDate == date - 1) return "Yesterday";
  }

  date = new Date(parseInt(timestamp) * 1000);
  const values = date.toDateString().split(" ");
  return values[2] + " " + values[1];
};
