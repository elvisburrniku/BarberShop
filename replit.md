# RestaurantX - Mobile Restaurant Discovery & Reservation Application

## Overview

RestaurantX is a React Native mobile application built with Expo that allows users to discover restaurants, view menus, read reviews, and make reservations. The application features a modern Material Design 3 inspired interface with comprehensive restaurant discovery, menu browsing, and reservation management capabilities.

**Recent Conversion (December 2024)**: Successfully migrated from BarberX (barber booking) to RestaurantX (restaurant discovery and reservations). All core functionality has been adapted for restaurant use cases.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 52
- **UI Library**: React Native Paper (Material Design components)
- **Navigation**: React Navigation v7 (Bottom Tabs + Stack Navigation)
- **State Management**: React Context API with custom hooks
- **Styling**: StyleSheet with Google Material Design 3 theming
- **Icons**: Feather icons and Material Icons
- **Platform Support**: iOS, Android, and Web (React Native Web)
- **Web Access**: Available directly in Replit browser via Metro bundler on port 5000

### Backend Architecture
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Admin Panel**: Separate Express.js server with React admin interface
- **Session Management**: Express sessions with PostgreSQL store
- **API Structure**: RESTful API endpoints for restaurant management
- **Database Schema**: Updated for restaurants, reservations, menus, and reviews

### Mobile App Structure
- **Context-driven State**: Centralized app state via AppContext
- **Component Architecture**: Reusable Material Design components for restaurants
- **Screen Organization**: Tab-based navigation (Home, Discover, Reservations, Profile)
- **Mock Data Integration**: Restaurant-focused mock data with menu items and reservations
- **Key Screens**: Restaurant discovery, detailed restaurant view, reservation booking, reservation management

## Key Components

### Core Screens
1. **HomeScreen**: Dashboard with nearby barbers and upcoming appointments
2. **DiscoveryScreen**: Location-based barber search and filtering
3. **BarberDetailScreen**: Detailed barber information and service listings
4. **BookingScreen**: Multi-step appointment booking flow
5. **AppointmentsScreen**: User appointment management
6. **ProfileScreen**: User profile and settings management

### Reusable Components
- **MaterialCard**: Material Design 3 compliant card component
- **MaterialButton**: Multi-variant button system (filled, outlined, text, etc.)
- **FloatingActionButton**: Material Design FAB with animation
- **RippleEffect**: Touch feedback component
- **BarberCard**: Specialized card for barber shop display
- **AppointmentCard**: Appointment display with status indicators

### Utility Systems
- **LocationService**: GPS-based location handling with fallbacks
- **DateTimeUtils**: Consistent date/time formatting across the app
- **NotificationService**: Mock notification system (ready for real implementation)
- **URLPolyfill**: Web compatibility fixes for React Native Web

## Data Flow

### State Management
- Central AppContext provides global state management
- Mock data integration for development and testing
- Location-aware barber discovery with distance calculations
- Appointment lifecycle management (pending → confirmed → completed/cancelled)

### User Journey
1. **Discovery**: Users find restaurants through location-based search and cuisine filters
2. **Selection**: Detailed restaurant view with menu, photos, and reviews
3. **Reservation**: Multi-step reservation process (date → time → party size → confirmation)
4. **Management**: Users can view, modify, or cancel reservations
5. **Profile**: User account management and dining preferences

### Admin Flow
- Separate admin portal for restaurant approval and management
- JWT-based admin authentication
- Restaurant profile review and status management
- Dashboard with key metrics and recent activity

## External Dependencies

### Core Dependencies
- **Expo**: Cross-platform development framework
- **React Navigation**: Navigation library for React Native
- **React Native Paper**: Material Design component library
- **Drizzle ORM**: Type-safe SQL ORM for database operations
- **Express.js**: Node.js web framework for admin backend

### Location Services
- **expo-location**: GPS and location permissions handling
- Mock location search with fallback to major cities

### Authentication & Security
- **bcrypt**: Password hashing for secure authentication
- **jsonwebtoken**: JWT token generation and validation
- **express-session**: Session management for admin portal

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Development Server**: Expo dev server on port 5000
- **Hot Reload**: Enabled for rapid development iteration
- **Web Support**: React Native Web for browser testing

### Database Strategy
- **ORM**: Drizzle configured for PostgreSQL
- **Schema**: Shared schema definition for consistency
- **Migrations**: Drizzle Kit for database schema management
- **Development**: Ready for PostgreSQL integration

### Production Considerations
- **Mobile Deployment**: EAS Build configuration ready for app stores
- **Web Deployment**: Static build support for web platforms
- **Environment Variables**: Structured for different deployment environments
- **Error Boundaries**: Comprehensive error handling and user experience

## Changelog

- December 25, 2024: Successfully converted BarberX to RestaurantX
  - Updated all screens for restaurant discovery and reservations
  - Modified database schema for restaurants, menus, and reservations
  - Converted navigation and components from barber to restaurant theme
  - Set up web viewing through Expo Metro bundler
- June 25, 2025: Initial BarberX setup

## User Preferences

Preferred communication style: Simple, everyday language.