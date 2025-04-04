import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import {
  Avatar,
  Title,
  Text,
  List,
  Switch,
  Button,
  Divider,
  Card,
  useTheme,
  Portal,
  Dialog,
  TextInput
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import { useAppContext } from '../context/AppContext';

const ProfileScreen = () => {
  const theme = useTheme();
  const { user, setUser } = useAppContext();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editTitle, setEditTitle] = useState('');

  // Open edit dialog for a specific field
  const openEditDialog = (field, value, title) => {
    setEditField(field);
    setEditValue(value);
    setEditTitle(title);
    setEditDialogVisible(true);
  };

  // Save edited field
  const saveEditedField = () => {
    if (editField && editValue) {
      setUser({
        ...user,
        [editField]: editValue
      });
    }
    setEditDialogVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`}
          style={styles.avatar} 
        />
        <View style={styles.headerInfo}>
          <Title style={styles.name}>{`${user.firstName} ${user.lastName}`}</Title>
          <Text style={styles.email}>{user.email}</Text>
          <Button 
            mode="outlined" 
            style={styles.editButton}
            onPress={() => openEditDialog('firstName', user.firstName, 'Edit Profile')}
          >
            Edit Profile
          </Button>
        </View>
      </View>

      <Divider />

      {/* Personal Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Personal Information</Title>
          
          <List.Item
            title="Name"
            description={`${user.firstName} ${user.lastName}`}
            left={props => <List.Icon {...props} icon="account" />}
            right={props => (
              <Button 
                {...props} 
                onPress={() => openEditDialog('firstName', user.firstName, 'Edit Name')}
              >
                Edit
              </Button>
            )}
            style={styles.listItem}
          />
          
          <List.Item
            title="Email"
            description={user.email}
            left={props => <List.Icon {...props} icon="email" />}
            right={props => (
              <Button 
                {...props} 
                onPress={() => openEditDialog('email', user.email, 'Edit Email')}
              >
                Edit
              </Button>
            )}
            style={styles.listItem}
          />
          
          <List.Item
            title="Phone"
            description={user.phone}
            left={props => <List.Icon {...props} icon="phone" />}
            right={props => (
              <Button 
                {...props} 
                onPress={() => openEditDialog('phone', user.phone, 'Edit Phone')}
              >
                Edit
              </Button>
            )}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Preferences */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Preferences</Title>
          
          <List.Item
            title="Notifications"
            description="Receive appointment reminders"
            left={props => <List.Icon {...props} icon="bell" />}
            right={props => (
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
          />
          
          <List.Item
            title="Location Services"
            description="Find barbers near me"
            left={props => <List.Icon {...props} icon="map-marker" />}
            right={props => (
              <Switch
                value={locationEnabled}
                onValueChange={setLocationEnabled}
                color={theme.colors.primary}
              />
            )}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Payment Methods */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Payment Methods</Title>
          
          <List.Item
            title="Add Payment Method"
            left={props => <List.Icon {...props} icon="credit-card" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Help & Support */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Help & Support</Title>
          
          <List.Item
            title="FAQ"
            left={props => <List.Icon {...props} icon="help-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Contact Support"
            left={props => <List.Icon {...props} icon="message-circle" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Terms of Service"
            left={props => <List.Icon {...props} icon="file-text" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
          
          <List.Item
            title="Privacy Policy"
            left={props => <List.Icon {...props} icon="lock" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            style={styles.listItem}
          />
        </Card.Content>
      </Card>

      {/* Logout */}
      <Button 
        mode="outlined" 
        icon="log-out" 
        style={styles.logoutButton}
        onPress={() => {}}
      >
        Log Out
      </Button>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>

      {/* Edit Dialog */}
      <Portal>
        <Dialog
          visible={editDialogVisible}
          onDismiss={() => setEditDialogVisible(false)}
        >
          <Dialog.Title>{editTitle}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Value"
              value={editValue}
              onChangeText={setEditValue}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditDialogVisible(false)}>Cancel</Button>
            <Button onPress={saveEditedField}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2c3e50',
  },
  headerInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
  },
  editButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  card: {
    margin: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  listItem: {
    paddingLeft: 0,
  },
  logoutButton: {
    margin: 16,
    borderColor: 'red',
    borderWidth: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  versionText: {
    color: '#999',
  },
  input: {
    marginTop: 10,
  },
});

export default ProfileScreen;
