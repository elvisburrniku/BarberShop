import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Banner } from 'react-native-paper';
import ApiService from '../services/ApiService';

export default function ApiStatusBanner() {
  const [apiStatus, setApiStatus] = useState('unknown');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      await ApiService.checkApiHealth();
      setApiStatus('connected');
      setVisible(false);
    } catch (error) {
      setApiStatus('offline');
      setVisible(true);
    }
  };

  if (!visible) return null;

  return (
    <Banner
      visible={visible}
      actions={[
        {
          label: 'Retry',
          onPress: checkApiStatus,
        },
        {
          label: 'Dismiss',
          onPress: () => setVisible(false),
        },
      ]}
      icon="wifi-off"
      style={styles.banner}
    >
      API connection unavailable. Using offline data.
    </Banner>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff3cd',
  },
});