import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm để lưu token
const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('userToken', token);
  } catch (error) {
    console.error('Lỗi khi lưu token:', error);
  }
};

// Hàm để lấy token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Lỗi khi lấy token:', error);
  }
};

const token = getToken();
const api = axios.create({
  baseURL: "http://192.168.40.108:8080/api/client",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
export const getAllProducthadPromotion = async (pagination) => {
    const { current, pageSize } = pagination;
    try {
      const response = await api.get("/getallproducthadpromotion", {
        params: { page: current, size: pageSize },
      });
      const { data, meta } = response.data;
      return { data, total: meta?.totalElement || 0 };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };
  export const getAllProducthadSoldDesc = async (pagination) => {
    const { current, pageSize } = pagination;
    try {
      const response = await api.get("/getallproducthadsoledesc", {
        params: { page: current, size: pageSize },
      });
      const { data, meta } = response.data;
      return { data, total: meta?.totalElement || 0 };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu.";
      console.error(errorMessage);
      throw error;
    }
  };  