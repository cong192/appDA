import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, Modal, ScrollView } from "react-native";
import ProductProd from "./ProductProd";
import { getAllProducthadSoldDesc } from "../api/apiView";
import Bill from "./Bill";

const ViewProduct = ({data}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducthadSoldDesc(pagination);
      setProducts(data.data);
      // console.log(data);
    };
    fetchData();
  }, []);
useEffect(() => {
  // console.log(data);
  if(data===true){
    setShowBill(true);
  }else if(data===false){
    setShowBill(false);
  }else{
    setBillData(data);
  }
}, [data]);
  return (
   <ScrollView >
     <View style={{ flex: 1 }}>
      <View style={styles.welcome}>
        <Text style={{color: "#f37021",fontSize: 20,fontWeight: "bold"}}>Chào mừng bạn đến với TheHands</Text>
        {/* <Button
          title="show hóa đơn"
          onPress={() => {
            setShowBill(true);
          }}
        /> */}
      </View>

      {/* Modal */}
      <Modal
        visible={showBill}
        onRequestClose={() => setShowBill(false)}
        // animationType="slide" // Thêm hiệu ứng khi hiển thị Modal
        transparent={true} // Để có nền trong suốt
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Bill
              billData={billData}
            />
            {/* <Button title="Đóng" onPress={() => setShowBill(false)} /> */}
          </View>
        </View>
      </Modal>

      {/* Danh sách sản phẩm */}
      <ScrollView style={{backgroundColor: "#f3702110"}}>
      <View style={styles.container}>
        {products.map((item) => (
          <View key={item.productDetailId} style={styles.productContainer}>
            <ProductProd product={item} />
          </View>
        ))}
      </View>
      </ScrollView>
    </View>
   </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // Cho phép các sản phẩm xuống dòng
    justifyContent: "flex-start", // Căn giữa các cột
    // backgroundColor: "#f3702110",
  },
  productContainer: {
    width: "20%", // Cố định chiều rộng cho mỗi sản phẩm
    marginBottom: 10, // Khoảng cách giữa các sản phẩm
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Tạo nền tối cho Modal/
  },
  modalContent: {
    width: "70%",
    height: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  welcome: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f3702110",
  justifyContent: "center",
  alignItems: "center",
  },
});

export default ViewProduct;
