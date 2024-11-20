export const calculateRange = (option: string): { from: number; to: number } => {
  const today = new Date();
  const to = today.getTime();
  const from = new Date(today);

  switch (option) {
    case "Last week":
      from.setDate(today.getDate() - 7);
      break;
    case "Last month":
      from.setMonth(today.getMonth() - 1);
      break;
    case "Last 3 months":
      from.setMonth(today.getMonth() - 3);
      break;
    case "Last 6 months":
      from.setMonth(today.getMonth() - 6);
      break;
    case "Last year":
      from.setFullYear(today.getFullYear() - 1);
      break;
    default:
      throw new Error(`Unknown option: ${option}`);
  }

  return { from: from.getTime(), to };
};