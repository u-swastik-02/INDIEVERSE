// Indian States & Union Territories Master Data
// Phase 1: Maharashtra is the ONLY active/available pilot region

export const INDIAN_REGIONS = [
  // Active Pilot State
  { 
    id: 'maharashtra', 
    name: 'Maharashtra', 
    type: 'state', 
    capital: 'Mumbai', 
    isAvailable: true, 
    tag: 'Active Pilot',
    highlight: 'Gateway of Maratha Valour, Sahyadri Forts, Paithani Silk & Dhol Tasha',
    stats: '36 Districts • 7 Cultural Realms'
  },

  // Other 27 States (Coming Soon)
  { id: 'andhra-pradesh', name: 'Andhra Pradesh', type: 'state', capital: 'Amaravati', isAvailable: false, tag: 'Coming Soon' },
  { id: 'arunachal-pradesh', name: 'Arunachal Pradesh', type: 'state', capital: 'Itanagar', isAvailable: false, tag: 'Coming Soon' },
  { id: 'assam', name: 'Assam', type: 'state', capital: 'Dispur', isAvailable: false, tag: 'Coming Soon' },
  { id: 'bihar', name: 'Bihar', type: 'state', capital: 'Patna', isAvailable: false, tag: 'Coming Soon' },
  { id: 'chhattisgarh', name: 'Chhattisgarh', type: 'state', capital: 'Raipur', isAvailable: false, tag: 'Coming Soon' },
  { id: 'goa', name: 'Goa', type: 'state', capital: 'Panaji', isAvailable: false, tag: 'Coming Soon' },
  { id: 'gujarat', name: 'Gujarat', type: 'state', capital: 'Gandhinagar', isAvailable: false, tag: 'Coming Soon' },
  { id: 'haryana', name: 'Haryana', type: 'state', capital: 'Chandigarh', isAvailable: false, tag: 'Coming Soon' },
  { id: 'himachal-pradesh', name: 'Himachal Pradesh', type: 'state', capital: 'Shimla', isAvailable: false, tag: 'Coming Soon' },
  { id: 'jharkhand', name: 'Jharkhand', type: 'state', capital: 'Ranchi', isAvailable: false, tag: 'Coming Soon' },
  { id: 'karnataka', name: 'Karnataka', type: 'state', capital: 'Bengaluru', isAvailable: false, tag: 'Coming Soon' },
  { id: 'kerala', name: 'Kerala', type: 'state', capital: 'Thiruvananthapuram', isAvailable: false, tag: 'Coming Soon' },
  { id: 'madhya-pradesh', name: 'Madhya Pradesh', type: 'state', capital: 'Bhopal', isAvailable: false, tag: 'Coming Soon' },
  { id: 'manipur', name: 'Manipur', type: 'state', capital: 'Imphal', isAvailable: false, tag: 'Coming Soon' },
  { id: 'meghalaya', name: 'Meghalaya', type: 'state', capital: 'Shillong', isAvailable: false, tag: 'Coming Soon' },
  { id: 'mizoram', name: 'Mizoram', type: 'state', capital: 'Aizawl', isAvailable: false, tag: 'Coming Soon' },
  { id: 'nagaland', name: 'Nagaland', type: 'state', capital: 'Kohima', isAvailable: false, tag: 'Coming Soon' },
  { id: 'odisha', name: 'Odisha', type: 'state', capital: 'Bhubaneswar', isAvailable: false, tag: 'Coming Soon' },
  { id: 'punjab', name: 'Punjab', type: 'state', capital: 'Chandigarh', isAvailable: false, tag: 'Coming Soon' },
  { id: 'rajasthan', name: 'Rajasthan', type: 'state', capital: 'Jaipur', isAvailable: false, tag: 'Coming Soon' },
  { id: 'sikkim', name: 'Sikkim', type: 'state', capital: 'Gangtok', isAvailable: false, tag: 'Coming Soon' },
  { id: 'tamil-nadu', name: 'Tamil Nadu', type: 'state', capital: 'Chennai', isAvailable: false, tag: 'Coming Soon' },
  { id: 'telangana', name: 'Telangana', type: 'state', capital: 'Hyderabad', isAvailable: false, tag: 'Coming Soon' },
  { id: 'tripura', name: 'Tripura', type: 'state', capital: 'Agartala', isAvailable: false, tag: 'Coming Soon' },
  { id: 'uttar-pradesh', name: 'Uttar Pradesh', type: 'state', capital: 'Lucknow', isAvailable: false, tag: 'Coming Soon' },
  { id: 'uttarakhand', name: 'Uttarakhand', type: 'state', capital: 'Dehradun', isAvailable: false, tag: 'Coming Soon' },
  { id: 'west-bengal', name: 'West Bengal', type: 'state', capital: 'Kolkata', isAvailable: false, tag: 'Coming Soon' },

  // 8 Union Territories (Coming Soon)
  { id: 'andaman-nicobar', name: 'Andaman & Nicobar Islands', type: 'ut', capital: 'Port Blair', isAvailable: false, tag: 'Coming Soon' },
  { id: 'chandigarh', name: 'Chandigarh', type: 'ut', capital: 'Chandigarh', isAvailable: false, tag: 'Coming Soon' },
  { id: 'dadra-nagar-haveli-daman-diu', name: 'Dadra & Nagar Haveli and Daman & Diu', type: 'ut', capital: 'Daman', isAvailable: false, tag: 'Coming Soon' },
  { id: 'delhi', name: 'Delhi (NCT)', type: 'ut', capital: 'New Delhi', isAvailable: false, tag: 'Coming Soon' },
  { id: 'jammu-kashmir', name: 'Jammu & Kashmir', type: 'ut', capital: 'Srinagar / Jammu', isAvailable: false, tag: 'Coming Soon' },
  { id: 'ladakh', name: 'Ladakh', type: 'ut', capital: 'Leh', isAvailable: false, tag: 'Coming Soon' },
  { id: 'lakshadweep', name: 'Lakshadweep', type: 'ut', capital: 'Kavaratti', isAvailable: false, tag: 'Coming Soon' },
  { id: 'puducherry', name: 'Puducherry', type: 'ut', capital: 'Puducherry', isAvailable: false, tag: 'Coming Soon' },
];

export const ACTIVE_PILOT_REGION = INDIAN_REGIONS.find(r => r.id === 'maharashtra');
