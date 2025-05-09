import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, Modal, ScrollView } from "react-native";
import ProductProd from "./ProductProd";
import { getAllProducthadPromotion, getAllProducthadSoldDesc } from "../api/apiView";
import Bill from "./Bill";

const ViewProduct = ({data}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize:5,
  });
  const [productHadPromotions, setProductHadPromotions] = useState([]);
  const [paginationPromotion, setPaginationPromotion] = useState({
    current: 1,
    pageSize: 5,
  });
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllProducthadSoldDesc(pagination);
      const data1 = await getAllProducthadPromotion(paginationPromotion);

      setProducts(data.data);
      setProductHadPromotions(data1.data);
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
        <Text style={{color: "#f37021",fontSize: 20,fontWeight: "bold"}}>CHÀO MỪNG BẠN ĐẾN VỚI THEHANDS</Text>
        <Text style={{color: "#f37021",fontSize: 20,fontWeight: "normal"}}> Chào mừng Ngày Giải phóng miền Nam 30/4 và Quốc tế Lao động 1/5!</Text>

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
      <View style={{ justifyContent:"flex-start",alignItems:"flex-start",marginLeft: 20,marginTop: 20, padding: 10,backgroundColor: "#f3702110"}}>  
        <Text style={{color: "#f37021",fontSize: 20,fontWeight: "bold"}}>SẢN PHẢM BÁN CHẠY</Text>
      </View>
      <View style={styles.container}>
        {products.map((item) => (
          <View key={item.productDetailId} style={styles.productContainer}>
            <ProductProd product={item} />
          </View>
        ))}
      </View>
      <View style={{ justifyContent:"flex-start",alignItems:"flex-start",marginLeft: 20,marginTop: 20, padding: 10,backgroundColor: "#f3702110"}}>  
        <Text style={{color: "#f37021",fontSize: 20,fontWeight: "bold"}}>SẢN PHẨM ĐANG GIẢM GIÁ</Text>
      </View>
      <View style={styles.container}>
        {productHadPromotions.map((item) => (
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
    // marginBottom: 20,
    padding: 10,
    backgroundColor: "#f3702110",
  justifyContent: "center",
  alignItems: "center",
  },
});

export default ViewProduct;
