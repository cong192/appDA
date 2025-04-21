import React, { memo, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Rating } from "react-native-ratings";

// Format price range function
const formatPriceRange = (price) => {
  if (!price) return ""; // Return empty string if price is empty

  // Convert to string if price is not a string
  const priceStr = String(price);

  // Check if it doesn't contain " - " then format a single value
  if (!priceStr.includes("-")) {
    return parseInt(priceStr).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }

  // Split string by " - "
  const priceParts = priceStr.split(" - ").map((p) => parseInt(p));

  if (priceParts.length === 2 && priceParts[0] === priceParts[1]) {
    return priceParts[0].toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    }); // If both prices are the same, display only one price
  }

  return `${priceParts[0].toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })} - ${priceParts[1].toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  })}`; // If different, format each value
};

function ProductProd({ product }) {
  // Create status badge content based on the product's statusSale
  const getStatusSaleContent = () => {
    switch(product.statusSale) {
      case "Hot":
        return (
          <View style={styles.statusContent}>
            <FontAwesome name="fire" size={12} color="#EE4D2D" />
            <Text style={styles.statusText}>Hot</Text>
          </View>
        );
      case "Best Sale":
        return (
          <View style={styles.statusContent}>
            <FontAwesome name="star" size={12} color="#EE4D2D" />
            <Text style={styles.statusText}>Best Sale</Text>
          </View>
        );
      case "Flash Sale":
        return (
          <View style={styles.statusContent}>
            <FontAwesome5 name="bolt" size={12} color="green" />
            <Text style={[styles.statusText, { color: "green" }]}>Flash Sale</Text>
          </View>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    console.log("prop đã ren");
  });

  return (
    <View style={styles.productCard}>
      <Image
        source={{ uri: `${product.imageUrl}`||"https://placehold.co/600x400" }}
        // source={{ uri:"https://res.cloudinary.com/dieyhvcou/image/upload/v1744730186/th_j4hbnt.jpg" }}
        style={styles.productImage}
        resizeMode="contain"
      />
      
      {/* Status Badge Position */}
      <View style={styles.badgePosition}>
        {product.statusSale && (
          <View style={styles.statusBadge}>
            {getStatusSaleContent()}
          </View>
        )}
      </View>
      
      <View style={styles.cardBody}>
        {/* Product Name */}
        <Text numberOfLines={2} style={styles.productName}>
          {product.productName}
        </Text>

        {/* Price Section */}
        <View style={styles.priceSection}>
          {product.promotionView?.maxDiscount > 0 ? (
            <View>
              <Text style={styles.salePrice}>
                {formatPriceRange(product.promotionView.rangePriceAfterPromotion)}
              </Text>
              <View style={styles.originalPriceRow}>
                <Text style={styles.originalPrice}>
                  {formatPriceRange(product.promotionView.rangePriceRoot)}
                </Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    - {product.promotionView.maxDiscount}%
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.salePrice}>
                {formatPriceRange(product.price)}
              </Text>
              <View style={styles.originalPriceRow}>
                <Text style={[styles.originalPrice, { color: 'white' }]}>
                  ko co
                </Text>
                {product.promotion ? (
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{product.promotion}</Text>
                  </View>
                ) : (
                  <View style={{ height: 15 }}></View>
                )}
              </View>
            </View>
          )}
        </View>
        
        {/* Rating */}
        <Rating
          readonly
          startingValue={product.rate || 5}
          imageSize={12}
          style={styles.ratingContainer}
        />
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <Text style={styles.statsText}>Đã bán: {product.sold}</Text>
          <Text style={styles.statsText}>Lượt xem: {product.views}</Text>
        </View>
        
        {/* No buttons in this version per original component's ending state */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    height: 300,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
    margin: 5,
  },
  productImage: {
    height: '55%',
    width: '100%',
    backgroundColor: 'white'
  },
  badgePosition: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  statusBadge: {
    backgroundColor: '#FEEEEA',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3,
    margin: 2,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EE4D2D',
    marginLeft: 4,
  },
  cardBody: {
    padding: 8,
    paddingTop: 0,
    flex: 1,
  },
  productName: {
    fontSize: 14,
    height: 40,
    marginBottom: 5,
  },
  priceSection: {
    marginBottom: 5,
  },
  salePrice: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#EE4D2D',
  },
  originalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    fontSize: 12,
  },
  discountBadge: {
    backgroundColor: '#FEEEEA',
    borderRadius: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 8,
  },
  discountText: {
    color: '#EE4D2D',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ratingContainer: {
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 12,
    color: '#555',
  },
});

export default memo(ProductProd);