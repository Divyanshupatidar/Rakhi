# Raksha Bandhan Website

## Overview

This is a personalized Raksha Bandhan website that allows users to find and view custom messages for sisters. The application is a simple client-side web application that displays personalized greetings and messages for specific sisters by name. It features a landing page where users can search for a sister's name, individual sister pages with personalized content, and an admin panel for management purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a traditional multi-page web architecture with vanilla HTML, CSS, and JavaScript. No modern frameworks are employed, keeping the implementation simple and lightweight.

**Key Components:**
- **Landing Page (`index.html`)**: Main entry point where users enter a sister's name to find their personalized page
- **Sister Page (`sister.html`)**: Dynamic page that displays personalized messages, greetings, and images based on URL parameters
- **Admin Panel (`admin.html`)**: Protected administrative interface (authentication mechanism not fully visible in provided code)

### Data Management
The application uses a JSON-based data storage approach for simplicity:
- **Static JSON File (`data.json`)**: Contains sister profiles with names, personalized messages, greetings, and associated images
- **Client-side Data Loading**: JavaScript fetches and processes sister data directly from the JSON file
- **Name-based Lookup**: Sisters are identified and retrieved using case-insensitive name matching

### Styling and Design
- **CSS Custom Properties**: Used for consistent theming with festival-appropriate colors (gold, saffron, pink, lavender)
- **Responsive Design**: Mobile-friendly layout using viewport meta tags and flexible CSS
- **External Dependencies**: Google Fonts (Poppins) and Font Awesome icons for enhanced typography and visual elements
- **Decorative Elements**: Animated floating rakhi-themed icons for festive atmosphere

### Navigation and User Flow
- **URL-based Routing**: Sister pages use URL parameters to identify which sister's content to display
- **Form-based Search**: Landing page uses form submission to navigate to sister pages
- **Error Handling**: Built-in error states for missing sisters or data loading failures

### Authentication (Admin Panel)
The admin panel includes a basic password-based authentication system, though the full implementation details are not visible in the provided code snippets.

## External Dependencies

### Third-party Services
- **Unsplash Images**: Sister profiles use Unsplash URLs for profile and decorative images
- **Google Fonts**: Poppins font family loaded via CDN for consistent typography
- **Font Awesome**: Icon library (version 6.0.0) for UI elements and decorative icons

### Browser Dependencies
- **Fetch API**: Used for loading JSON data asynchronously
- **URL Parameters**: For sister page routing and identification
- **Local Storage**: Likely used for admin session management (though not fully visible in provided code)

### Development Dependencies
The application appears to be designed for static hosting and doesn't require server-side processing, build tools, or complex deployment pipelines. All assets are either self-contained or loaded from CDNs.