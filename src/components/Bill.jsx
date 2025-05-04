import React, { useEffect, useMemo } from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";
import { generateAddressString } from "../utils/apiGHN";
import GenQRPayMent from "./GenQRPayMent";

const Bill = ({ billData }) => {
  console.log("đây là bill dât", billData);
  // Helper function to format currency in VND
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "đ");
  };

  // Helper function to translate status to Vietnamese
  const translateStatus = (status) => {
    const statusMap = {
      CHO_XAC_NHAN: "Chờ xác nhận",
      DA_XAC_NHAN: "Đã xác nhận",
      DANG_GIAO: "Đang giao",
      DA_GIAO: "Đã giao",
      DA_HUY: "Đã hủy",
    };
    return statusMap[status] || "Chưa xác định";
  };

  // Safe early return
  // if (!billData) {
  //   return (
  //     <View>
  //       <Text>Không có thông tin hóa đơn</Text>
  //     </View>
  //   );
  // }

  // Map new data structure to existing component props
  const {
    key,
    billCode,
    recipientName,
    recipientPhoneNumber,
    payInfo,
    productList,
    detailAddressShipping,
    shippingFee,
    vouchers,
    itemName,
    isShipping,
    isSuccess
  } = billData;

  // Format address with null checks
  const [address, setAddress] = React.useState("Đang tải...");

  useEffect(() => {
    let isCancelled = false; // Flag để hủy tác vụ bất đồng bộ

    const fetchAddress = async () => {
      if (isShipping) {
        const add = await generateAddressString(
          detailAddressShipping.provinceId,
          detailAddressShipping.districtId,
          detailAddressShipping.wardId.toString(),
          detailAddressShipping.specificAddress
        );
        if (!isCancelled) {
          setAddress(add); // Chỉ cập nhật nếu tác vụ chưa bị hủy
        }
      } else {
        setAddress("Không có thông tin địa chỉ");
      }
    };

    fetchAddress();

    return () => {
      isCancelled = true; // Hủy tác vụ khi component unmount hoặc dependencies thay đổi
    };
  }, [isShipping, detailAddressShipping]);
  // Map status (since status is not provided, default to a placeholder)
  const status = billData.isSuccess ? "Đã thanh toán" : "Chưa thanh toán";

  // Map payment method
  const payment = payInfo?.paymentMethods || "Không xác định";

  // Map voucher (assuming first voucher if available)
  const voucher = vouchers?.length > 0 ? vouchers[0].code || "Không có" : null;

  // Calculate totals
  const totalMoney = payInfo?.amount || 0;
  const discount = payInfo?.discount || 0;
  const moneyAfter = totalMoney + shippingFee;

  return (
    <ScrollView style={styles.container}>
      {/* Bill Header */}
      <View style={styles.billHeader}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{billCode || itemName}</Text>
          {/* <View style={styles.statusBadge}> */}
          {/* <Text style={styles.statusText}>{translateStatus(status)}</Text> */}
          {/* </View> */}
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Tên:</Text>{" "}
              <Text>{recipientName || "Không xác định"}</Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Số điện thoại:</Text>{" "}
              <Text> {recipientPhoneNumber || "Không xác định"}</Text>
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Email:</Text> Không xác định
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Địa chỉ:</Text> {address}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Phương thức thanh toán:</Text> {payment}
            </Text>
          </View>
        </View>
      </View>

      {/* Product Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>

        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableHeader, styles.productCell]}>Sản phẩm</Text>
          <Text style={[styles.tableHeader, styles.qtyCell]}>SL</Text>
          <Text style={[styles.tableHeader, styles.priceCell]}>Đơn giá</Text>
          <Text style={[styles.tableHeader, styles.totalCell]}>Thành tiền</Text>
        </View>
      </View>
      {/* Table Content */}
      {productList?.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <View style={[styles.tableCell, styles.productCell]}>
            <View style={styles.productInfo}>
              <Image
                source={{
                  uri: item.image[0]?.url || "https://via.placeholder.com/40",
                }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <Text style={styles.productText}>
                {item.productName} ({item.brandName})
              </Text>
            </View>
          </View>
          <Text style={[styles.tableCell, styles.qtyCell]}>
            {item.quantityInCart || 1}
          </Text>
          <View style={[styles.tableCell, styles.priceCell]}>
            {item.promotionResponse?.discountValue ? (
              <View style={{ display: "flex", flexDirection: "column" }}>
                <Text style={{ textDecorationLine: "line-through" }}>
                  {formatCurrency(item.price)}
                </Text>
                <Text>Giảm: {item.promotionResponse?.discountValue}%</Text>
                {/* Tính giá sau khi giảm */}
                <Text style={{ color: "#F37021" }}>
                  {formatCurrency(
                    item.price -
                      (item.price * item.promotionResponse?.discountValue) / 100
                  )}
                </Text>
              </View>
            ) : (
              <Text>{formatCurrency(item.price)}</Text>
            )}
          </View>
          <Text style={[styles.tableCell, styles.totalCell]}>
            {formatCurrency(
              (item.promotionResponse?.discountValue
                ? item.price -
                  (item.price * item.promotionResponse?.discountValue) / 100
                : item.price) * (item.quantityInCart || 1)
            )}
          </Text>
        </View>
      ))}
      {/* Bill Summary */}
      <View style={styles.customerInfo}>
        <View>
          {/* <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP.75m8FRaW9DRQtRHMAaXS8gHaIL?rs=1&pid=ImgDetMain",
            }}
            style={styles.placeholderImage}
          /> */}
          <Text>Quét mã để thanh toán</Text>
          <GenQRPayMent
            // amount={moneyAfter}
            amount={payInfo?.amount}
            currentBill={key}
            // transactionCode={payInfo?.transactionCode}
          />
          <View>
          <Text>{status}</Text>
        </View>
        </View>
        
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text>Tổng tiền hàng:</Text>
            <Text style={styles.bold}>
              {formatCurrency(totalMoney + payInfo?.discount)}
            </Text>
          </View>
          {voucher && (
            <View style={styles.summaryRow}>
              <Text>Voucher:</Text>
              <Text style={styles.bold}>
                {formatCurrency(payInfo?.discount)}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text>Phí vận chuyển:</Text>
            <Text style={styles.bold}>{formatCurrency(shippingFee)}</Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.bold}>Tổng thanh toán:</Text>
            <Text style={styles.totalAmount}>{formatCurrency(moneyAfter)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    width: "100%",
  },
  billHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 12,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#854D0E",
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  customerInfo: {
    marginBottom: 8,
    // display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // display: "grid",
    // gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  infoBlock: {
    marginBottom: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 8,
  },
  tableHeader: {
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
  },
  tableCell: {
    padding: 8,
  },
  productCell: {
    flex: 2,
  },
  qtyCell: {
    flex: 0.5,
    textAlign: "center",
  },
  priceCell: {
    flex: 1,
    textAlign: "right",
  },
  totalCell: {
    flex: 1,
    textAlign: "right",
  },
  productInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  productText: {
    flex: 1,
  },
  summarySection: {
    marginTop: 12,
    alignSelf: "stretch",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 4,
    paddingTop: 8,
  },
  totalAmount: {
    fontWeight: "bold",
    color: "#dc2626",
  },
  placeholderImage: {
    width: 150,
    height: 150,
    alignSelf: "center",
  },
});

export default Bill;
