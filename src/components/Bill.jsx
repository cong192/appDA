import React from "react";
import { View, Text, Image, ScrollView, StyleSheet } from "react-native";

const Bill = ({ billData }) => {
  console.log("đây là bill dât",billData);
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
    billCode,
    recipientName,
    recipientPhoneNumber,
    payInfo,
    productList,
    detailAddressShipping,
    shippingFee,
    vouchers,
    itemName,
  } = billData;

  // Format address with null checks
  const address = detailAddressShipping
    ? `${detailAddressShipping.specificAddress || ""}, ${
        detailAddressShipping.wardId || ""
      }, ${detailAddressShipping.districtId || ""}, ${
        detailAddressShipping.provinceId || ""
      }`.trim() || "Không có thông tin địa chỉ"
    : "Không có thông tin địa chỉ";

  // Map status (since status is not provided, default to a placeholder)
  const status = billData.isSuccess ? "DA_GIAO" : "CHO_XAC_NHAN";

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
          <Text style={styles.title}>Hóa đơn: {billCode || itemName}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{translateStatus(status)}</Text>
          </View>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <View style={styles.customerInfo}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Tên:</Text>{" "}
              {recipientName || "Không xác định"}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Số điện thoại:</Text>{" "}
              {recipientPhoneNumber || "Không xác định"}
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

        {/* Table Content */}
        {productList?.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <View style={[styles.tableCell, styles.productCell]}>
              <View style={styles.productInfo}>
                <Image
                  source={{ uri: item.image[0].url || "https://via.placeholder.com/40" }}
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
            <Text style={[styles.tableCell, styles.priceCell]}>
              {formatCurrency(item.price)}
            </Text>
            <Text style={[styles.tableCell, styles.totalCell]}>
              {formatCurrency((item.price || 0) * (item.quantityInCart || 1))}
            </Text>
          </View>
        ))}
      </View>

      {/* Bill Summary */}
      <View style={styles.customerInfo}>
        <View>
          <Image
            source={{
              uri:
                "https://th.bing.com/th/id/OIP.75m8FRaW9DRQtRHMAaXS8gHaIL?rs=1&pid=ImgDetMain",
            }}
            style={styles.placeholderImage}
          />
        </View>
        <View style={styles.summarySection}>
        <View style={styles.summaryRow}>
            <Text>Tổng tiền hàng:</Text>
            <Text style={styles.bold}>{formatCurrency(totalMoney+payInfo?.discount)}</Text>
          </View>
        {voucher && (
            <View style={styles.summaryRow}>
              <Text>Voucher:</Text>
              <Text style={styles.bold}>{formatCurrency(payInfo?.discount)}</Text>
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBlock: {
    marginBottom: 12,
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