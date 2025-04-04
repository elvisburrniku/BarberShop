import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { 
  Modal, 
  Portal, 
  Searchbar, 
  List, 
  Button, 
  Text,
  useTheme,
  ActivityIndicator
} from 'react-native-paper';
import { searchLocations } from '../utils/LocationService';

const LocationSearch = ({ visible, onDismiss, onSelectLocation }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle search input change
  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    
    if (query.length >= 3) {
      setLoading(true);
      try {
        // In a real app, this would call a location API
        const locationResults = await searchLocations(query);
        setResults(locationResults);
      } catch (error) {
        console.error('Error searching locations:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    onSelectLocation(location);
    onDismiss();
  };

  // Use current location
  const useCurrentLocation = () => {
    onSelectLocation({ description: 'Current Location' });
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContent}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Find barbers near...</Text>
          
          <Searchbar
            placeholder="Search for a location"
            onChangeText={handleSearchChange}
            value={searchQuery}
            style={styles.searchBar}
            autoFocus
          />
          
          <Button 
            icon="map-marker" 
            mode="outlined" 
            onPress={useCurrentLocation}
            style={styles.currentLocationButton}
          >
            Use Current Location
          </Button>
          
          {loading ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.name}
                  description={item.description}
                  left={(props) => <List.Icon {...props} icon="map-marker" />}
                  onPress={() => handleLocationSelect(item)}
                  style={styles.listItem}
                />
              )}
              style={styles.resultsList}
              ListEmptyComponent={
                searchQuery.length > 0 && (
                  <Text style={styles.emptyText}>
                    {searchQuery.length < 3 
                      ? 'Type at least 3 characters to search' 
                      : 'No locations found'}
                  </Text>
                )
              }
            />
          )}
          
          <Button 
            onPress={onDismiss}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  currentLocationButton: {
    marginBottom: 16,
  },
  resultsList: {
    maxHeight: 300,
  },
  listItem: {
    paddingVertical: 8,
  },
  loading: {
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    margin: 20,
    color: '#666',
  },
  cancelButton: {
    marginTop: 16,
  },
});

export default LocationSearch;
