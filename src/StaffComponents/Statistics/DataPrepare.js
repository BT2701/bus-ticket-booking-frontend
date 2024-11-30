import ApiService from "../../Components/Utils/apiService";
export const fetchDataStatusBooking = async () => {
  try {
    const data = await ApiService.get("api/statistic/tinhtrangve");
    if (data) {
      return data;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
