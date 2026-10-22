import type { Stop } from "@/types";

/**
 * DEMO DATA — approximate stop locations in and around Chennai.
 * Coordinates are indicative and should be replaced with operator GTFS data.
 */
export const STOPS: Stop[] = [
  { id: "broadway", name: "Broadway (Parry's)", tamilName: "பிராட்வே", area: "George Town", lat: 13.0896, lng: 80.2864, type: "terminus", bays: ["Bay 1", "Bay 2", "Bay 3", "Bay 4"], amenities: ["Shelter", "Enquiry counter"] },
  { id: "central", name: "Chennai Central", tamilName: "சென்னை சென்ட்ரல்", area: "Park Town", lat: 13.0827, lng: 80.2757, type: "stop", bays: ["Stand A", "Stand B"], amenities: ["Shelter", "Rail interchange"] },
  { id: "egmore", name: "Egmore", tamilName: "எழும்பூர்", area: "Egmore", lat: 13.078, lng: 80.261, type: "stop", amenities: ["Shelter", "Rail interchange"] },
  { id: "gemini", name: "Gemini (Anna Salai)", tamilName: "ஜெமினி", area: "Thousand Lights", lat: 13.0569, lng: 80.2502, type: "stop", amenities: ["Shelter"] },
  { id: "teynampet", name: "Teynampet", tamilName: "தேனாம்பேட்டை", area: "Teynampet", lat: 13.04, lng: 80.25, type: "stop", amenities: ["Metro interchange"] },
  { id: "saidapet", name: "Saidapet", tamilName: "சைதாப்பேட்டை", area: "Saidapet", lat: 13.0213, lng: 80.2231, type: "stop", amenities: ["Shelter", "Rail interchange"] },
  { id: "guindy", name: "Guindy", tamilName: "கிண்டி", area: "Guindy", lat: 13.0067, lng: 80.2206, type: "stop", bays: ["Bay 1", "Bay 2"], amenities: ["Shelter", "Metro interchange", "Rail interchange"] },
  { id: "airport", name: "Airport (Meenambakkam)", tamilName: "விமான நிலையம்", area: "Meenambakkam", lat: 12.9941, lng: 80.1709, type: "stop", amenities: ["Metro interchange"] },
  { id: "chromepet", name: "Chromepet", tamilName: "குரோம்பேட்டை", area: "Chromepet", lat: 12.9516, lng: 80.1462, type: "stop", amenities: ["Shelter"] },
  { id: "tambaram", name: "Tambaram", tamilName: "தாம்பரம்", area: "Tambaram", lat: 12.9249, lng: 80.118, type: "terminus", bays: ["Bay 1", "Bay 2", "Bay 3"], amenities: ["Shelter", "Rail interchange", "Enquiry counter"] },
  { id: "kilambakkam", name: "Kilambakkam (KCBT)", tamilName: "கிளாம்பாக்கம்", area: "Vandalur", lat: 12.8676, lng: 80.0806, type: "terminus", bays: ["Platform 1", "Platform 2", "Platform 3", "Platform 4", "Platform 5", "Platform 6"], amenities: ["Waiting hall", "Food court", "Enquiry counter", "Restrooms"] },
  { id: "cmbt", name: "Koyambedu (CMBT)", tamilName: "கோயம்பேடு", area: "Koyambedu", lat: 13.0694, lng: 80.1948, type: "terminus", bays: ["Platform 1", "Platform 2", "Platform 3", "Platform 4", "Platform 5"], amenities: ["Waiting hall", "Metro interchange", "Enquiry counter", "Restrooms"] },
  { id: "vadapalani", name: "Vadapalani", tamilName: "வடபழனி", area: "Vadapalani", lat: 13.05, lng: 80.2121, type: "stop", amenities: ["Shelter", "Metro interchange"] },
  { id: "ashoknagar", name: "Ashok Nagar", tamilName: "அசோக் நகர்", area: "Ashok Nagar", lat: 13.037, lng: 80.212, type: "stop", amenities: ["Shelter"] },
  { id: "velachery", name: "Velachery", tamilName: "வேளச்சேரி", area: "Velachery", lat: 12.9815, lng: 80.218, type: "stop", amenities: ["Shelter", "Rail interchange"] },
  { id: "taramani", name: "Taramani", tamilName: "தரமணி", area: "Taramani", lat: 12.9863, lng: 80.2432, type: "stop", amenities: ["Shelter"] },
  { id: "sholinganallur", name: "Sholinganallur", tamilName: "சோழிங்கநல்லூர்", area: "OMR", lat: 12.901, lng: 80.2279, type: "stop", amenities: ["Shelter"] },
  { id: "kelambakkam", name: "Kelambakkam", tamilName: "கேளம்பாக்கம்", area: "OMR", lat: 12.7865, lng: 80.2193, type: "terminus", bays: ["Bay 1", "Bay 2"] },
  { id: "perambur", name: "Perambur", tamilName: "பெரம்பூர்", area: "Perambur", lat: 13.1167, lng: 80.2333, type: "terminus", bays: ["Bay 1", "Bay 2"], amenities: ["Rail interchange"] },
  { id: "royapettah", name: "Royapettah", tamilName: "ராயப்பேட்டை", area: "Royapettah", lat: 13.054, lng: 80.264, type: "stop" },
  { id: "mylapore", name: "Mylapore", tamilName: "மயிலாப்பூர்", area: "Mylapore", lat: 13.0339, lng: 80.2676, type: "stop", amenities: ["Shelter"] },
  { id: "adyar", name: "Adyar", tamilName: "அடையார்", area: "Adyar", lat: 13.0012, lng: 80.2565, type: "depot", bays: ["Bay 1", "Bay 2"], amenities: ["Shelter", "Depot"] },
  { id: "besantnagar", name: "Besant Nagar", tamilName: "பெசன்ட் நகர்", area: "Besant Nagar", lat: 12.999, lng: 80.2707, type: "terminus", bays: ["Bay 1"] },
  { id: "annanagar", name: "Anna Nagar", tamilName: "அண்ணா நகர்", area: "Anna Nagar", lat: 13.085, lng: 80.2101, type: "depot", bays: ["Bay 1", "Bay 2"], amenities: ["Depot", "Metro interchange"] },
  { id: "kilpauk", name: "Kilpauk", tamilName: "கீழ்ப்பாக்கம்", area: "Kilpauk", lat: 13.085, lng: 80.242, type: "stop" },
  { id: "tnagar", name: "T. Nagar", tamilName: "தி. நகர்", area: "T. Nagar", lat: 13.0418, lng: 80.2341, type: "terminus", bays: ["Bay 1", "Bay 2", "Bay 3"], amenities: ["Shelter", "Enquiry counter"] },
  { id: "thiruvanmiyur", name: "Thiruvanmiyur", tamilName: "திருவான்மியூர்", area: "Thiruvanmiyur", lat: 12.983, lng: 80.2594, type: "terminus", bays: ["Bay 1", "Bay 2"], amenities: ["Shelter"] },
  { id: "poonamallee", name: "Poonamallee", tamilName: "பூந்தமல்லி", area: "Poonamallee", lat: 13.0473, lng: 80.0945, type: "terminus", bays: ["Bay 1", "Bay 2"] },
  { id: "porur", name: "Porur", tamilName: "போரூர்", area: "Porur", lat: 13.0359, lng: 80.158, type: "stop", amenities: ["Shelter"] },
  { id: "ramapuram", name: "Ramapuram", tamilName: "ராமாபுரம்", area: "Ramapuram", lat: 13.0317, lng: 80.178, type: "stop", amenities: ["Shelter"] },
  { id: "thiruvottiyur", name: "Thiruvottiyur", tamilName: "திருவொற்றியூர்", area: "Thiruvottiyur", lat: 13.1601, lng: 80.3003, type: "terminus", bays: ["Bay 1"] },
  { id: "tondiarpet", name: "Tondiarpet", tamilName: "தண்டையார்பேட்டை", area: "Tondiarpet", lat: 13.126, lng: 80.288, type: "stop" },
  { id: "neelankarai", name: "Neelankarai", tamilName: "நீலாங்கரை", area: "ECR", lat: 12.949, lng: 80.259, type: "stop" },
  { id: "kovalam", name: "Kovalam", tamilName: "கோவளம்", area: "ECR", lat: 12.788, lng: 80.251, type: "stop" },
  { id: "mahabalipuram", name: "Mamallapuram", tamilName: "மாமல்லபுரம்", area: "Mamallapuram", lat: 12.6208, lng: 80.1945, type: "terminus", bays: ["Bay 1", "Bay 2"] },
  { id: "guduvancheri", name: "Guduvancheri", tamilName: "கூடுவாஞ்சேரி", area: "Guduvancheri", lat: 12.8454, lng: 80.0603, type: "stop" },
  { id: "chengalpattu", name: "Chengalpattu", tamilName: "செங்கல்பட்டு", area: "Chengalpattu", lat: 12.6921, lng: 79.9766, type: "terminus", bays: ["Bay 1", "Bay 2", "Bay 3"] },
  { id: "sriperumbudur", name: "Sriperumbudur", tamilName: "ஸ்ரீபெரும்புதூர்", area: "Sriperumbudur", lat: 12.9675, lng: 79.9419, type: "stop" },
  { id: "kanchipuram", name: "Kanchipuram", tamilName: "காஞ்சிபுரம்", area: "Kanchipuram", lat: 12.8342, lng: 79.7036, type: "terminus", bays: ["Bay 1", "Bay 2"] },
  { id: "ranipet", name: "Ranipet", tamilName: "ராணிப்பேட்டை", area: "Ranipet", lat: 12.9273, lng: 79.3333, type: "stop" },
  { id: "vellore", name: "Vellore", tamilName: "வேலூர்", area: "Vellore", lat: 12.9165, lng: 79.1325, type: "terminus", bays: ["Platform 1", "Platform 2"] },
  { id: "krishnagiri", name: "Krishnagiri", tamilName: "கிருஷ்ணகிரி", area: "Krishnagiri", lat: 12.5186, lng: 78.2137, type: "stop" },
  { id: "bengaluru", name: "Bengaluru", tamilName: "பெங்களூரு", area: "Karnataka", lat: 12.9352, lng: 77.6245, type: "terminus" },
  { id: "salem", name: "Salem", tamilName: "சேலம்", area: "Salem", lat: 11.6643, lng: 78.146, type: "stop" },
  { id: "coimbatore", name: "Coimbatore", tamilName: "கோயம்புத்தூர்", area: "Coimbatore", lat: 11.0168, lng: 76.9558, type: "terminus", bays: ["Platform 1", "Platform 2"] },
  { id: "tindivanam", name: "Tindivanam", tamilName: "திண்டிவனம்", area: "Tindivanam", lat: 12.234, lng: 79.6556, type: "stop" },
  { id: "villupuram", name: "Villupuram", tamilName: "விழுப்புரம்", area: "Villupuram", lat: 11.9401, lng: 79.4861, type: "stop" },
  { id: "marakkanam", name: "Marakkanam", tamilName: "மரக்காணம்", area: "ECR", lat: 12.192, lng: 79.95, type: "stop" },
  { id: "puducherry", name: "Puducherry", tamilName: "புதுச்சேரி", area: "Puducherry", lat: 11.9416, lng: 79.8083, type: "terminus", bays: ["Platform 1", "Platform 2"] },
  { id: "trichy", name: "Tiruchirappalli", tamilName: "திருச்சிராப்பள்ளி", area: "Tiruchirappalli", lat: 10.7905, lng: 78.7047, type: "stop" },
  { id: "madurai", name: "Madurai", tamilName: "மதுரை", area: "Madurai", lat: 9.9252, lng: 78.1198, type: "terminus", bays: ["Platform 1", "Platform 2"] },
];

export const STOP_MAP: Record<string, Stop> = Object.fromEntries(STOPS.map((s) => [s.id, s]));

/** Stops inside the Chennai metropolitan view (used for city map defaults). */
export const CITY_STOP_IDS = new Set([
  "broadway", "central", "egmore", "gemini", "teynampet", "saidapet", "guindy", "airport", "chromepet",
  "tambaram", "kilambakkam", "cmbt", "vadapalani", "ashoknagar", "velachery", "taramani", "sholinganallur",
  "kelambakkam", "perambur", "royapettah", "mylapore", "adyar", "besantnagar", "annanagar", "kilpauk",
  "tnagar", "thiruvanmiyur", "poonamallee", "porur", "ramapuram", "thiruvottiyur", "tondiarpet",
  "neelankarai", "kovalam", "guduvancheri",
]);

/** Default demo "current location" — used when browser location is unavailable. */
export const DEMO_LOCATION = { lat: 13.0101, lng: 80.2161, label: "Guindy (demo location)" };

export const CHENNAI_CENTER: [number, number] = [13.04, 80.215];
