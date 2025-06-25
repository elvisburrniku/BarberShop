import { db } from "./db.js";
import { 
  subscriptionPlans, 
  restaurants, 
  menuCategories, 
  menuItems, 
  customers,
  tables 
} from "../shared/schema.js";

async function seedDatabase() {
  console.log("Seeding database...");

  try {
    // Create subscription plans
    const plans = await db.insert(subscriptionPlans).values([
      {
        name: "Free Trial",
        description: "14-day free trial with basic features",
        price: 0,
        maxRestaurants: 1,
        maxBookingsPerMonth: 50,
        trialDays: 14,
        features: JSON.stringify(["Basic booking", "Customer management", "Email notifications"]),
        isActive: true,
      },
      {
        name: "Starter",
        description: "Perfect for small restaurants",
        price: 2900, // $29.00
        maxRestaurants: 1,
        maxBookingsPerMonth: 200,
        trialDays: 14,
        features: JSON.stringify(["All Free features", "Advanced analytics", "Custom branding"]),
        isActive: true,
      },
      {
        name: "Professional",
        description: "For growing restaurant businesses",
        price: 7900, // $79.00
        maxRestaurants: 3,
        maxBookingsPerMonth: 1000,
        trialDays: 14,
        features: JSON.stringify(["All Starter features", "Multiple locations", "API access", "Priority support"]),
        isActive: true,
      }
    ]).returning();

    // Create sample restaurants
    const sampleRestaurants = await db.insert(restaurants).values([
      {
        tenantId: null,
        userId: 1, // Placeholder - will be updated when users are created
        name: "Bella Italia",
        description: "Authentic Italian cuisine in the heart of downtown",
        cuisine: "Italian",
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94102",
        phone: "(415) 555-0123",
        email: "info@bellaitalia.com",
        website: "https://bellaitalia.com",
        lat: "37.7749",
        lng: "-122.4194",
        rating: "4.5",
        priceLevel: 3,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
        openingHours: JSON.stringify({
          monday: { open: "11:00", close: "22:00" },
          tuesday: { open: "11:00", close: "22:00" },
          wednesday: { open: "11:00", close: "22:00" },
          thursday: { open: "11:00", close: "22:00" },
          friday: { open: "11:00", close: "23:00" },
          saturday: { open: "10:00", close: "23:00" },
          sunday: { open: "10:00", close: "21:00" }
        }),
        emailSettings: JSON.stringify({}),
        isActive: true,
        approvalStatus: "approved",
      },
      {
        tenantId: null,
        userId: 1,
        name: "Sakura Sushi",
        description: "Fresh sushi and Japanese cuisine",
        cuisine: "Japanese",
        address: "456 California Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94108",
        phone: "(415) 555-0456",
        email: "orders@sakurasushi.com",
        website: "https://sakurasushi.com",
        lat: "37.7849",
        lng: "-122.4094",
        rating: "4.7",
        priceLevel: 4,
        imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800",
        openingHours: JSON.stringify({
          monday: { open: "17:00", close: "22:00" },
          tuesday: { open: "17:00", close: "22:00" },
          wednesday: { open: "17:00", close: "22:00" },
          thursday: { open: "17:00", close: "22:00" },
          friday: { open: "17:00", close: "23:00" },
          saturday: { open: "16:00", close: "23:00" },
          sunday: { open: "16:00", close: "21:00" }
        }),
        emailSettings: JSON.stringify({}),
        isActive: true,
        approvalStatus: "approved",
      },
      {
        tenantId: null,
        userId: 1,
        name: "The Garden Café",
        description: "Farm-to-table dining with organic ingredients",
        cuisine: "American",
        address: "789 Market Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94103",
        phone: "(415) 555-0789",
        email: "hello@gardencafe.com",
        website: "https://gardencafe.com",
        lat: "37.7649",
        lng: "-122.4194",
        rating: "4.3",
        priceLevel: 2,
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        openingHours: JSON.stringify({
          monday: { open: "08:00", close: "20:00" },
          tuesday: { open: "08:00", close: "20:00" },
          wednesday: { open: "08:00", close: "20:00" },
          thursday: { open: "08:00", close: "20:00" },
          friday: { open: "08:00", close: "21:00" },
          saturday: { open: "09:00", close: "21:00" },
          sunday: { open: "09:00", close: "20:00" }
        }),
        emailSettings: JSON.stringify({}),
        isActive: true,
        approvalStatus: "approved",
      }
    ]).returning();

    console.log(`Created ${sampleRestaurants.length} sample restaurants`);

    // Create menu categories for first restaurant (Bella Italia)
    const categories = await db.insert(menuCategories).values([
      {
        restaurantId: sampleRestaurants[0].id,
        name: "Appetizers",
        description: "Start your meal with our delicious appetizers",
        sortOrder: 1,
        isActive: true,
      },
      {
        restaurantId: sampleRestaurants[0].id,
        name: "Pasta",
        description: "Fresh handmade pasta dishes",
        sortOrder: 2,
        isActive: true,
      },
      {
        restaurantId: sampleRestaurants[0].id,
        name: "Pizza",
        description: "Wood-fired pizza with authentic Italian toppings",
        sortOrder: 3,
        isActive: true,
      },
      {
        restaurantId: sampleRestaurants[0].id,
        name: "Desserts",
        description: "Sweet endings to your perfect meal",
        sortOrder: 4,
        isActive: true,
      }
    ]).returning();

    // Create menu items
    await db.insert(menuItems).values([
      // Appetizers
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[0].id,
        name: "Bruschetta al Pomodoro",
        description: "Grilled bread topped with fresh tomatoes, basil, and garlic",
        price: "12.95",
        imageUrl: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=400",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[0].id,
        name: "Antipasto Classico",
        description: "Selection of cured meats, cheeses, olives, and roasted vegetables",
        price: "18.95",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        isAvailable: true,
        sortOrder: 2,
      },
      // Pasta
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[1].id,
        name: "Spaghetti Carbonara",
        description: "Classic Roman pasta with eggs, pecorino cheese, pancetta, and black pepper",
        price: "22.95",
        imageUrl: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=400",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[1].id,
        name: "Fettuccine Alfredo",
        description: "Fresh fettuccine in a rich parmesan cream sauce",
        price: "19.95",
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
        isAvailable: true,
        sortOrder: 2,
      },
      // Pizza
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[2].id,
        name: "Margherita",
        description: "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil",
        price: "16.95",
        imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400",
        isAvailable: true,
        sortOrder: 1,
      },
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[2].id,
        name: "Quattro Stagioni",
        description: "Four seasons pizza with artichokes, ham, mushrooms, and olives",
        price: "21.95",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
        isAvailable: true,
        sortOrder: 2,
      },
      // Desserts
      {
        restaurantId: sampleRestaurants[0].id,
        categoryId: categories[3].id,
        name: "Tiramisu",
        description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
        price: "8.95",
        imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        isAvailable: true,
        sortOrder: 1,
      }
    ]);

    // Create tables for restaurants
    for (const restaurant of sampleRestaurants) {
      const tablesToCreate = [];
      for (let i = 1; i <= 10; i++) {
        tablesToCreate.push({
          restaurantId: restaurant.id,
          tenantId: restaurant.tenantId,
          tableNumber: `T${i.toString().padStart(2, '0')}`,
          capacity: i <= 6 ? 2 : i <= 8 ? 4 : 6,
          isActive: true,
        });
      }
      await db.insert(tables).values(tablesToCreate);
    }

    console.log("✅ Database seeded successfully!");
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };