import model from '../models/index.js';

const seedFlowers = async () => {
    try {
        const FlowersData = [
            {
                name: 'Red Rose Bouquet',
                description: 'Beautiful red roses perfect for romantic occasions',
                price: 29.99,
                originalPrice: 39.99,
                category: 'roses',
                image: 'https://images.pexels.com/photos/1164985/pexels-photo-1164985.jpeg?auto=compress&cs=tinysrgb&w=400',
                stock: 50
            },
            {
                name: 'Sunflower Bundle',
                description: 'Bright and cheerful sunflowers to brighten any day',
                price: 24.99,
                category: 'sunflowers',
                image: 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400',
                stock: 50
            },
            {
                name: 'Mixed Spring Flowers',
                description: 'A beautiful arrangement of seasonal spring flowers',
                price: 34.99,
                category: 'mixed',
                image: 'https://images.pexels.com/photos/1146603/pexels-photo-1146603.jpeg?auto=compress&cs=tinysrgb&w=400',
                stock: 50
            },
            {
                name: 'White Lily Arrangement',
                description: 'Elegant white lilies for special occasions',
                price: 42.99,
                category: 'lilies',
                image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400',
                stock: 50
            },
            {
                name: 'Pink Tulip Bouquet',
                description: 'Fresh pink tulips perfect for spring celebrations',
                price: 27.99,
                category: 'tulips',
                image: 'https://cdn.uaeflowers.com/uploads/product/uaeflowers/8379_21_8379.webp',
                stock: 50
            },
            {
                name: 'Purple Orchid Plant',
                description: 'Exotic purple orchid plant for home decoration',
                price: 55.99,
                category: 'orchids',
                image: 'https://images.pexels.com/photos/1449087/pexels-photo-1449087.jpeg?auto=compress&cs=tinysrgb&w=400',
                stock: 50
            }
        ];

        for (const flower of FlowersData) {
            await model.Flower.create({
                name: flower.name,
                description: flower.description,
                price: flower.price,
                category: flower.category,
                image: flower.image,
                stock: flower.stock
            });
        }

        console.log('✅ Flowers seeded successfully!');
    } catch (error) {
        console.log('Failed to seed flowers:', error);
    }
};

export default seedFlowers;