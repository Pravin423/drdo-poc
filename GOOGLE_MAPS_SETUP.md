# Google Maps Setup Guide for GIS Attendance Map

## Overview
The GIS Attendance Map feature provides real-time tracking of Community Resource Persons (CRPs) across Goa using Google Maps integration.

## Features
- **Real-time Location Tracking**: Automatic updates every 30 seconds to show current CRP positions
- **Status-based Filtering**: Filter CRPs by Present, Absent, or Exception status
- **Interactive Map Markers**: Click markers to view detailed CRP information
- **Color-coded Visualization**: 
  - 🟢 Green: Present
  - 🔴 Red: Absent
  - 🟠 Orange: Exception
- **Expandable CRP Cards**: View coordinates, accuracy, and timestamps for each CRP
- **Responsive Layout**: Map and sidebar layout adapts to screen size

## Setup Instructions

### 1. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API (optional, for address lookups)
4. Go to "Credentials" and create an API key
5. (Recommended) Restrict your API key:
   - Application restrictions: HTTP referrers
   - Add your domain (e.g., `localhost:3000`, `yourdomain.com`)
   - API restrictions: Select "Maps JavaScript API"

### 2. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and add your API key:
   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

### 3. Verify Installation

1. Navigate to Dashboard → Attendance Management
2. Click on the "GIS Map" tab
3. You should see a map with CRP location markers

## Real-time Updates

The component automatically updates CRP locations every 30 seconds. In a production environment, you would replace the simulated updates with actual data from your backend API.

### Integrating with Real Data

To connect to your real-time tracking system:

1. Open `src/components/dashboard/GISMapTab.js`
2. Replace the `useEffect` hook that simulates updates with your API call:

```javascript
useEffect(() => {
  const fetchCRPLocations = async () => {
    try {
      const response = await fetch('/api/crp-locations');
      const data = await response.json();
      setCRPData(data);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Failed to fetch CRP locations:', error);
    }
  };

  // Initial fetch
  fetchCRPLocations();

  // Poll every 30 seconds
  const interval = setInterval(fetchCRPLocations, 30000);
  return () => clearInterval(interval);
}, []);
```

## Component Structure

```
GISMapTab
├── Filter Buttons (All, Present, Absent, Exceptions)
├── Google Map
│   ├── Markers (color-coded by status)
│   └── Info Windows (click to view details)
└── CRP Locations Sidebar
    └── Expandable Cards
        ├── Name & ID
        ├── Coordinates
        ├── Accuracy
        └── Timestamp
```

## Customization

### Changing Map Center
Edit the `center` constant in `GISMapTab.js`:
```javascript
const center = {
  lat: 15.4909,  // Latitude
  lng: 73.8278   // Longitude
};
```

### Adjusting Update Interval
Modify the interval in the `useEffect` hook:
```javascript
const interval = setInterval(() => {
  // Update logic
}, 30000); // Change 30000 to desired milliseconds
```

### Modifying Marker Colors
Edit the `statusConfig` object:
```javascript
const statusConfig = {
  present: {
    markerColor: "#10b981", // Change to your preferred color
    // ... other properties
  },
  // ... other statuses
};
```

## Troubleshooting

### Map Not Displaying
- Verify your API key is correct in `.env.local`
- Check browser console for API errors
- Ensure Maps JavaScript API is enabled in Google Cloud Console
- Restart your development server after adding the API key

### Markers Not Showing
- Check that CRP data includes valid `coordinates` with `lat` and `lng`
- Verify coordinates are within valid ranges (-90 to 90 for lat, -180 to 180 for lng)

### Real-time Updates Not Working
- Check browser console for errors
- Verify the update interval is running (look for console logs if you add them)
- Ensure state updates are triggering re-renders

## API Rate Limits

Google Maps API has usage limits. For development:
- Free tier: $200 credit per month
- Maps JavaScript API: ~28,000 map loads per month free

For production, monitor your usage and set up billing alerts in Google Cloud Console.

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. Add API key restrictions in Google Cloud Console
3. Set up billing alerts to prevent unexpected charges
4. Use environment-specific API keys (dev, staging, prod)
5. Regularly rotate your API keys

## Support

For issues or questions:
- Check Google Maps Platform documentation: https://developers.google.com/maps
- Review Next.js environment variables: https://nextjs.org/docs/basic-features/environment-variables
