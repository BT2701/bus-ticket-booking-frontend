import axios from "axios";
export const fetchDataStatusBooking = async () => {
  try {
    const data = await axios.get(
      `http://localhost:8080/api/statistic/tinhtrangve`
    );
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
