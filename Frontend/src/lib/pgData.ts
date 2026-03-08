import pgRoom1 from "@/assets/pg-room-1.jpg";
import pgRoom2 from "@/assets/pg-room-2.jpg";
import pgRoom3 from "@/assets/pg-room-3.jpg";
import pgRoom4 from "@/assets/pg-room-4.jpg";
import pgRoom5 from "@/assets/pg-room-5.jpg";
import pgRoom6 from "@/assets/pg-room-6.jpg";

export interface PGListing {
  id: string;
  name: string;
  location: string;
  area: string;
  distance: number;
  verified: boolean;
  overallScore: number;
  hygiene: number;
  foodQuality: number;
  safety: number;
  amenitiesScore: number;
  pricingFairness: number;
  price: number;
  fairPrice: number;
  priceStatus: "Fair Price" | "Underpriced" | "Overpriced";
  roomType: string;
  hasAC: boolean;
  foodIncluded: boolean;
  images: string[];
  amenities: string[];
  claims: { claim: string; avgRating: number; status: "Match" | "Slight Mismatch" | "Mismatch" }[];
  reviews: {
    author: string;
    verified: boolean;
    date: string;
    rating: number;
    text: string;
    hygiene: number;
    food: number;
    safety: number;
    amenities: number;
    ownerReply?: string;
  }[];
}

export const pgListings: PGListing[] = [
  {
    id: "elite-stay",
    name: "Elite Stay",
    location: "Whitefield, Bangalore",
    area: "Whitefield",
    distance: 6.2,
    verified: true,
    overallScore: 94,
    hygiene: 96,
    foodQuality: 90,
    safety: 92,
    amenitiesScore: 88,
    pricingFairness: 90,
    price: 15000,
    fairPrice: 14500,
    priceStatus: "Fair Price",
    roomType: "Single",
    hasAC: true,
    foodIncluded: true,
    images: [pgRoom1, pgRoom3, pgRoom5],
    amenities: ["WiFi", "AC", "Meals", "Laundry", "Parking", "Security"],
    claims: [
      { claim: "24/7 Hot Water", avgRating: 4.7, status: "Match" },
      { claim: "Daily Cleaning", avgRating: 4.5, status: "Match" },
      { claim: "3 Meals/Day", avgRating: 4.2, status: "Match" },
      { claim: "High-Speed WiFi", avgRating: 4.8, status: "Match" },
    ],
    reviews: [
      {
        author: "Verified Resident",
        verified: true,
        date: "2024-02-15",
        rating: 5,
        text: "Excellent PG! Clean rooms, great food, and very responsive management.",
        hygiene: 5, food: 5, safety: 5, amenities: 4,
        ownerReply: "Thank you! We strive to provide the best experience.",
      },
      {
        author: "Anonymous",
        verified: true,
        date: "2024-01-28",
        rating: 4,
        text: "Good place overall. WiFi could be faster during peak hours.",
        hygiene: 4, food: 4, safety: 5, amenities: 4,
      },
    ],
  },
  {
    id: "metro-living",
    name: "Metro Living",
    location: "Indiranagar, Bangalore",
    area: "Indiranagar",
    distance: 0.8,
    verified: true,
    overallScore: 91,
    hygiene: 88,
    foodQuality: 85,
    safety: 94,
    amenitiesScore: 90,
    pricingFairness: 95,
    price: 7500,
    fairPrice: 8200,
    priceStatus: "Underpriced",
    roomType: "Triple",
    hasAC: false,
    foodIncluded: true,
    images: [pgRoom2, pgRoom4, pgRoom6],
    amenities: ["WiFi", "Meals", "Laundry", "Security"],
    claims: [
      { claim: "24/7 Hot Water", avgRating: 4.3, status: "Match" },
      { claim: "Daily Cleaning", avgRating: 3.9, status: "Slight Mismatch" },
      { claim: "3 Meals/Day", avgRating: 4.5, status: "Match" },
    ],
    reviews: [
      {
        author: "Anonymous",
        verified: true,
        date: "2024-02-10",
        rating: 4,
        text: "Great value for money. Location is fantastic.",
        hygiene: 4, food: 4, safety: 5, amenities: 4,
      },
    ],
  },
  {
    id: "sunshine-pg",
    name: "Sunshine PG",
    location: "Koramangala, Bangalore",
    area: "Koramangala",
    distance: 1.2,
    verified: true,
    overallScore: 87,
    hygiene: 92,
    foodQuality: 85,
    safety: 88,
    amenitiesScore: 80,
    pricingFairness: 82,
    price: 8500,
    fairPrice: 8160,
    priceStatus: "Overpriced",
    roomType: "Double",
    hasAC: true,
    foodIncluded: true,
    images: [pgRoom4, pgRoom2, pgRoom1],
    amenities: ["WiFi", "AC", "Meals", "Laundry", "Parking", "Security"],
    claims: [
      { claim: "24/7 Hot Water", avgRating: 4.5, status: "Match" },
      { claim: "Daily Cleaning", avgRating: 4.2, status: "Match" },
      { claim: "3 Meals/Day", avgRating: 3.8, status: "Slight Mismatch" },
      { claim: "High-Speed WiFi", avgRating: 4.8, status: "Match" },
    ],
    reviews: [
      {
        author: "Verified Resident",
        verified: true,
        date: "2024-02-15",
        rating: 5,
        text: "Great place to stay. Clean rooms and good food quality. WiFi is excellent.",
        hygiene: 5, food: 4, safety: 5, amenities: 4,
        ownerReply: "Thank you for the feedback! We're glad you enjoyed your stay.",
      },
      {
        author: "Anonymous",
        verified: true,
        date: "2024-01-20",
        rating: 3,
        text: "Average experience. Washrooms need more attention.",
        hygiene: 2, food: 3, safety: 4, amenities: 3,
      },
      {
        author: "Anonymous",
        verified: false,
        date: "2024-01-05",
        rating: 5,
        text: "Excellent PG! Highly recommend for students.",
        hygiene: 5, food: 5, safety: 5, amenities: 5,
      },
    ],
  },
  {
    id: "cozy-corner",
    name: "Cozy Corner PG",
    location: "Marathahalli, Bangalore",
    area: "Marathahalli",
    distance: 4.5,
    verified: false,
    overallScore: 78,
    hygiene: 82,
    foodQuality: 75,
    safety: 80,
    amenitiesScore: 72,
    pricingFairness: 85,
    price: 6500,
    fairPrice: 6400,
    priceStatus: "Fair Price",
    roomType: "Single",
    hasAC: false,
    foodIncluded: false,
    images: [pgRoom3, pgRoom5, pgRoom6],
    amenities: ["WiFi", "Laundry", "Security"],
    claims: [
      { claim: "24/7 Hot Water", avgRating: 3.5, status: "Slight Mismatch" },
      { claim: "Daily Cleaning", avgRating: 3.2, status: "Mismatch" },
    ],
    reviews: [
      {
        author: "Anonymous",
        verified: true,
        date: "2024-01-15",
        rating: 3,
        text: "Decent for the price. Don't expect too much.",
        hygiene: 3, food: 3, safety: 4, amenities: 3,
      },
    ],
  },
  {
    id: "greenview",
    name: "GreenView Residency",
    location: "HSR Layout, Bangalore",
    area: "HSR Layout",
    distance: 2.4,
    verified: false,
    overallScore: 72,
    hygiene: 68,
    foodQuality: 70,
    safety: 78,
    amenitiesScore: 72,
    pricingFairness: 65,
    price: 12000,
    fairPrice: 9500,
    priceStatus: "Overpriced",
    roomType: "Single",
    hasAC: true,
    foodIncluded: true,
    images: [pgRoom5, pgRoom1, pgRoom3],
    amenities: ["WiFi", "AC", "Meals", "Security"],
    claims: [
      { claim: "24/7 Hot Water", avgRating: 3.0, status: "Mismatch" },
      { claim: "Daily Cleaning", avgRating: 2.8, status: "Mismatch" },
      { claim: "3 Meals/Day", avgRating: 3.5, status: "Slight Mismatch" },
    ],
    reviews: [
      {
        author: "Anonymous",
        verified: true,
        date: "2024-02-01",
        rating: 2,
        text: "Overpriced for what you get. Cleaning is inconsistent.",
        hygiene: 2, food: 3, safety: 4, amenities: 3,
      },
    ],
  },
  {
    id: "urban-nest",
    name: "Urban Nest",
    location: "Electronic City, Bangalore",
    area: "Electronic City",
    distance: 8.1,
    verified: true,
    overallScore: 85,
    hygiene: 86,
    foodQuality: 82,
    safety: 90,
    amenitiesScore: 84,
    pricingFairness: 88,
    price: 9000,
    fairPrice: 8800,
    priceStatus: "Fair Price",
    roomType: "Double",
    hasAC: true,
    foodIncluded: true,
    images: [pgRoom6, pgRoom4, pgRoom2],
    amenities: ["WiFi", "AC", "Meals", "Laundry", "Parking", "Security", "Gym"],
    claims: [
      { claim: "24/7 Hot Water", avgRating: 4.2, status: "Match" },
      { claim: "Daily Cleaning", avgRating: 4.0, status: "Match" },
      { claim: "3 Meals/Day", avgRating: 4.1, status: "Match" },
      { claim: "Gym Access", avgRating: 3.8, status: "Slight Mismatch" },
    ],
    reviews: [
      {
        author: "Verified Resident",
        verified: true,
        date: "2024-02-20",
        rating: 4,
        text: "Good PG with nice amenities. Gym equipment could be updated.",
        hygiene: 4, food: 4, safety: 5, amenities: 4,
      },
    ],
  },
];
