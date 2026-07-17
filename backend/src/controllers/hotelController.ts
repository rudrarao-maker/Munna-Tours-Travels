import { Request, Response } from 'express';
import prisma from '../config/prisma';

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req: Request, res: Response) => {
  try {
    const { city, state, type, minRating, minPrice, maxPrice, search } = req.query;
    
    const where: any = { isActive: true };
    if (city) where.city = String(city);
    if (state) where.state = String(state);
    if (type) where.type = String(type);
    if (minRating) where.starRating = { gte: parseInt(String(minRating)) };
    
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) where.pricePerNight.gte = parseFloat(String(minPrice));
      if (maxPrice) where.pricePerNight.lte = parseFloat(String(maxPrice));
    }
    
    if (search) {
      where.OR = [
        { name: { contains: String(search) } },
        { location: { contains: String(search) } },
        { city: { contains: String(search) } },
        { state: { contains: String(search) } },
      ];
    }

    const hotels = await prisma.hotel.findMany({
      where,
      orderBy: { starRating: 'desc' },
    });

    // Fallback if DB is empty
    if (hotels.length === 0) {
      let fallbacks = getFallbackHotels();
      if (state) fallbacks = fallbacks.filter(h => h.state.toLowerCase() === String(state).toLowerCase());
      if (type) fallbacks = fallbacks.filter(h => h.type.toLowerCase() === String(type).toLowerCase());
      return res.json(fallbacks);
    }

    res.json(hotels);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching hotels', error: error.message });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req: Request, res: Response): Promise<void> => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: req.params.id }
    });
    if (!hotel) {
      res.status(404).json({ message: 'Hotel not found' });
      return;
    }
    res.json(hotel);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching hotel', error: error.message });
  }
};

// @desc    Create hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await prisma.hotel.create({ data: req.body });
    res.status(201).json(hotel);
  } catch (error: any) {
    res.status(400).json({ message: 'Error creating hotel', error: error.message });
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req: Request, res: Response) => {
  try {
    const hotel = await prisma.hotel.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(hotel);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating hotel', error: error.message });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req: Request, res: Response) => {
  try {
    await prisma.hotel.delete({ where: { id: req.params.id } });
    res.json({ message: 'Hotel removed' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting hotel', error: error.message });
  }
};

function getFallbackHotels() {
  return [
    {
      id: 'h1', name: 'The Leela Palace', location: 'Udaipur, Rajasthan', city: 'Udaipur', state: 'Rajasthan', type: '5-Star Hotel',
      description: 'A stunning lakeside palace hotel offering royal heritage luxury with modern amenities.',
      starRating: 5, pricePerNight: 18500, amenities: '["WiFi","Pool","Spa","Restaurant","Gym","Lake View"]',
      images: '["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"]',
      contactPhone: '+91 294 242 8800', contactEmail: 'reservations@theleela.com',
      latitude: 24.5764, longitude: 73.6836, isActive: true, totalRooms: 80, availableRooms: 12,
    },
    {
      id: 'h2', name: 'Taj Hotel & Convention Centre', location: 'Agra, Uttar Pradesh', city: 'Agra', state: 'Uttar Pradesh', type: '5-Star Hotel',
      description: 'Premium hotel with breathtaking views of the Taj Mahal, world-class dining and spa.',
      starRating: 5, pricePerNight: 14200, amenities: '["WiFi","Pool","Spa","Restaurant","Bar","Taj View"]',
      images: '["https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800"]',
      contactPhone: '+91 562 223 1515', contactEmail: 'agra@tajhotels.com',
      latitude: 27.1750, longitude: 78.0422, isActive: true, totalRooms: 120, availableRooms: 25,
    },
    {
      id: 'h3', name: 'ITC Grand Bharat', location: 'Gurugram, Haryana', city: 'Gurugram', state: 'Haryana', type: 'Resort',
      description: 'India\'s first all-suite luxury retreat, inspired by Mughal palaces.',
      starRating: 5, pricePerNight: 22000, amenities: '["WiFi","Pool","Spa","Golf","Restaurant","Butler"]',
      images: '["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800"]',
      contactPhone: '+91 124 464 5000', contactEmail: 'itcgrand@itchotels.com',
      latitude: 28.2380, longitude: 77.0100, isActive: true, totalRooms: 104, availableRooms: 18,
    },
    {
      id: 'h4', name: 'Radisson Blu Resort', location: 'Goa', city: 'Goa', state: 'Goa', type: 'Resort',
      description: 'Beachfront resort with tropical gardens, infinity pool, and Goan hospitality.',
      starRating: 4, pricePerNight: 8500, amenities: '["WiFi","Pool","Beach","Restaurant","Bar","Spa"]',
      images: '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800"]',
      contactPhone: '+91 832 672 8888', contactEmail: 'goa@radisson.com',
      latitude: 15.4989, longitude: 73.8278, isActive: true, totalRooms: 150, availableRooms: 40,
    },
    {
      id: 'h5', name: 'Zostel Jaipur', location: 'Jaipur, Rajasthan', city: 'Jaipur', state: 'Rajasthan', type: 'Hostel',
      description: 'Vibrant budget-friendly hostel in the Pink City with rooftop cafe and heritage vibes.',
      starRating: 3, pricePerNight: 1200, amenities: '["WiFi","Cafe","Rooftop","Lounge","Tours"]',
      images: '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"]',
      contactPhone: '+91 141 404 5000', contactEmail: 'jaipur@zostel.com',
      latitude: 26.9124, longitude: 75.7873, isActive: true, totalRooms: 60, availableRooms: 22,
    },
    {
      id: 'h6', name: 'Marriott Resort & Spa', location: 'Mussoorie, Uttarakhand', city: 'Mussoorie', state: 'Uttarakhand', type: 'Resort',
      description: 'Hilltop retreat with panoramic Himalayan views, spa, and adventure activities.',
      starRating: 4, pricePerNight: 11000, amenities: '["WiFi","Spa","Restaurant","Mountain View","Gym","Kids Area"]',
      images: '["https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800"]',
      contactPhone: '+91 135 263 1000', contactEmail: 'mussoorie@marriott.com',
      latitude: 30.4598, longitude: 78.0644, isActive: true, totalRooms: 90, availableRooms: 15,
    },
    {
      id: 'h7', name: 'Lemon Tree Premier', location: 'Mumbai, Maharashtra', city: 'Mumbai', state: 'Maharashtra', type: '4-Star Hotel',
      description: 'Modern business hotel close to the airport with fine dining.',
      starRating: 4, pricePerNight: 6500, amenities: '["WiFi","Pool","Gym","Restaurant"]',
      images: '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800"]',
      contactPhone: '+91 22 2345 6789', contactEmail: 'mumbai@lemontree.com',
      latitude: 19.0760, longitude: 72.8777, isActive: true, totalRooms: 120, availableRooms: 50,
    }
  ];
}
