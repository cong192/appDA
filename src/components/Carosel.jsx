import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const handleScroll = (event) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  // Auto scroll every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 500);

    return () => clearInterval(interval);
  }, [activeIndex, images.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: width,
    height: 500, // 🔺 chiều cao lớn hơn
    resizeMode: 'cover',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#333',
  },
});

export default Carousel;
