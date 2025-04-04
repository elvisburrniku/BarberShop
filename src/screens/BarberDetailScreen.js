import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Image, Dimensions } from 'react-native';
import { 
  Title, 
  Text, 
  Button, 
  Chip, 
  Card, 
  List, 
  Avatar,
  useTheme, 
  Divider 
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { useAppContext } from '../context/AppContext';
import RatingStars from '../components/RatingStars';
import ServiceItem from '../components/ServiceItem';

const { width } = Dimensions.get('window');

const BarberDetailScreen = ({ route, navigation }) => {
  const theme = useTheme();
  const { barberId } = route.params;
  const { barberShops, services, toggleFavoriteBarber, setSelectedBarber } = useAppContext();
  
  const [barber, setBarber] = useState(null);
  const [barberServices, setBarberServices] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState(false);

  useEffect(() => {
    const selectedBarber = barberShops.find(b => b.id === barberId);
    setBarber(selectedBarber);
    
    // Get services for this barber
    if (selectedBarber) {
      const filteredServices = services.filter(s => 
        selectedBarber.serviceIds.includes(s.id)
      );
      setBarberServices(filteredServices);
    }
  }, [barberId, barberShops, services]);

  const handleBookNow = () => {
    setSelectedBarber(barber);
    navigation.navigate('Booking');
  };

  const handleFavoriteToggle = () => {
    toggleFavoriteBarber(barberId);
  };

  if (!barber) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading barber details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header/Cover Image */}
      <Image 
        source={{ uri: barber.coverImage }} 
        style={styles.coverImage}
        defaultSource={require('../assets/logo.svg')}
      />

      {/* Barber shop info card */}
      <Card style={styles.detailsCard}>
        <Card.Content>
          <View style={styles.infoHeader}>
            <View>
              <Title style={styles.title}>{barber.name}</Title>
              <View style={styles.ratingContainer}>
                <RatingStars rating={barber.rating} size={16} />
                <Text style={styles.ratingText}>({barber.reviewCount} reviews)</Text>
              </View>
              <Text style={styles.address}>{barber.location.address}</Text>
            </View>
            <Icon 
              name={barber.isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={barber.isFavorite ? theme.colors.error : theme.colors.text}
              onPress={handleFavoriteToggle}
            />
          </View>
          
          <View style={styles.chipContainer}>
            <Chip icon="map-marker" style={styles.chip}>{barber.distance} miles</Chip>
            <Chip icon="clock" style={styles.chip}>
              {barber.isOpen ? 'Open Now' : 'Closed'}
            </Chip>
            <Chip icon="currency-usd" style={styles.chip}>
              {'$'.repeat(barber.priceLevel)}
            </Chip>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{barber.description}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Services Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Services</Title>
        <View style={styles.servicesContainer}>
          {barberServices.map(service => (
            <ServiceItem 
              key={service.id} 
              service={service} 
              onPress={() => {
                setSelectedBarber(barber);
                navigation.navigate('Booking', { initialServiceId: service.id });
              }}
            />
          ))}
        </View>
      </View>

      {/* Barbers Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Our Barbers</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {barber.barbers.map(barberStaff => (
            <Card key={barberStaff.id} style={styles.barberCard}>
              <Card.Content style={styles.barberCardContent}>
                <Avatar.Image 
                  source={{ uri: barberStaff.avatar }}
                  size={70}
                  style={styles.barberAvatar}
                />
                <Text style={styles.barberName}>{barberStaff.name}</Text>
                <RatingStars rating={barberStaff.rating} size={12} />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* Reviews Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Reviews</Title>
        {barber.reviews.slice(0, expandedReviews ? barber.reviews.length : 2).map((review, index) => (
          <View key={index} style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <Avatar.Text size={40} label={review.userName.charAt(0)} />
              <View style={styles.reviewUser}>
                <Text style={styles.reviewUserName}>{review.userName}</Text>
                <RatingStars rating={review.rating} size={12} />
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewText}>{review.comment}</Text>
            {index < barber.reviews.length - 1 && <Divider style={styles.divider} />}
          </View>
        ))}
        {barber.reviews.length > 2 && (
          <Button 
            onPress={() => setExpandedReviews(!expandedReviews)}
            style={styles.viewMoreButton}
          >
            {expandedReviews ? 'Show Less' : 'View All Reviews'}
          </Button>
        )}
      </View>

      {/* Location Section */}
      <View style={styles.section}>
        <Title style={styles.sectionTitle}>Location</Title>
        <Card style={styles.mapCard}>
          <Card.Content>
            {/* This would be a map in a real app */}
            <View style={styles.mapPlaceholder}>
              <Icon name="map" size={32} color={theme.colors.primary} />
              <Text style={styles.mapText}>Map View</Text>
            </View>
            <Text style={styles.address}>{barber.location.address}</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Booking Button */}
      <View style={styles.bookingContainer}>
        <Button 
          mode="contained" 
          style={styles.bookButton}
          contentStyle={styles.bookButtonContent}
          onPress={handleBookNow}
        >
          Book Now
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  detailsCard: {
    margin: 16,
    elevation: 4,
    marginTop: -30,
    borderRadius: 10,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  address: {
    marginTop: 4,
    color: '#666',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 15,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  infoSection: {
    marginTop: 15,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
  },
  servicesContainer: {
    marginTop: 5,
  },
  barberCard: {
    width: 120,
    marginRight: 12,
    elevation: 2,
  },
  barberCardContent: {
    alignItems: 'center',
    padding: 10,
  },
  barberAvatar: {
    marginBottom: 8,
  },
  barberName: {
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  reviewContainer: {
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    marginLeft: 10,
    flex: 1,
  },
  reviewUserName: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  reviewText: {
    lineHeight: 20,
  },
  divider: {
    marginVertical: 12,
  },
  viewMoreButton: {
    marginTop: 8,
  },
  mapCard: {
    elevation: 2,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
  },
  mapText: {
    marginTop: 8,
    color: '#666',
  },
  bookingContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  bookButton: {
    borderRadius: 8,
  },
  bookButtonContent: {
    height: 50,
  },
});

export default BarberDetailScreen;
