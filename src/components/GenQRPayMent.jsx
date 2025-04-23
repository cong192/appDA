import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { Notifier, NotifierComponents } from 'react-native-notifier';

const { SE_PAY_API_KEY } = Constants.expoConfig.extra;

const GenQRPayMent = ({ amount, currentBill, transactionCode, handleBankCustomerMoneyChange }) => {
  const tokenSePay = SE_PAY_API_KEY;
  const [qrUrl, setQrUrl] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const genQrUrl = (amount, des) => {
    return `https://qr.sepay.vn/img?acc=68682581998&bank=TPB&amount=${amount}&des=${des}`;
  };

  useEffect(() => {
    if (amount > 0 && currentBill) {
      const url = genQrUrl(amount, currentBill);
      setQrUrl(url);
      if (!transactionCode) {
        setPaymentSuccess(false);
      }
      const timeoutId = setTimeout(() => setQrUrl(''), 5 * 60 * 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setQrUrl('');
    }
  }, [amount, currentBill, transactionCode]);

//   useEffect(() => {
//     if (!paymentSuccess && qrUrl) {
//       const intervalId = setInterval(() => {
//         fetchTransactions();
//       }, 6500);
//       return () => clearInterval(intervalId);
//     }
//   }, [paymentSuccess, qrUrl]);

  const fetchTransactions = async () => {
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const formatDate = (date) => date.toISOString().split('T')[0];

      const response = await axios.get('http://192.168.40.108:8080/userapi/transactions/list', {
        params: {
          transaction_date_min: formatDate(today),
          transaction_date_max: formatDate(tomorrow),
        },
        headers: {
          Authorization: `Bearer ${tokenSePay}`,
        },
      });

      const billTransaction = response.data.transactions.find(
        (t) => t.transaction_content.split(' ')[0] === currentBill
      );

      if (billTransaction) {
        handleBankCustomerMoneyChange(billTransaction.amount_in, billTransaction.reference_number);
        setPaymentSuccess(true);
        Notifier.showNotification({
          title: 'Thanh toán thành công!',
          description: `Giao dịch: ${billTransaction.reference_number}`,
          Component: NotifierComponents.Alert,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy giao dịch:', error);
    }
  };

  return qrUrl ? (
    <View style={styles.qrContainer}>
      <Image source={{ uri: qrUrl }} style={styles.qrImage} />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  qrImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
});

export default GenQRPayMent;
