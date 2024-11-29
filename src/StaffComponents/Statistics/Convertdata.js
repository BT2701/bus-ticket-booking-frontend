export const convertDataForLineChartRechar = (data, idName) => {
  return data.map((item) => ({
    name: item[0],
    [idName]: item[1],
  }));
};

export const transformDataForLineChartMutil = (input) => {
  const rawData = typeof input === "string" ? JSON.parse(input) : input;
  const groupedByDate = {};
  rawData.forEach(([date, routeName, Revenue]) => {
    if (!groupedByDate[date]) {
      groupedByDate[date] = { name: date };
    }

    groupedByDate[date][routeName] = Revenue;
  });

  return Object.values(groupedByDate);
};

export const convertDataForPieChart = (input, labels) => {
  return input.map((value, index) => ({
    id: labels[index],
    label: labels[index],
    value: value,
  }));
};
