package com.swayamcraft.config;

import com.swayamcraft.model.*;
import com.swayamcraft.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 1. Seed Users
        User adminUser = null;
        if (!userRepository.existsByEmail("admin@swayamcraft.com")) {
            adminUser = User.builder()
                    .fullName("Swayam Crafts Artisan Admin")
                    .email("admin@swayamcraft.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .phone("+91 98765 43210")
                    .address("Studio 4B, Artisan Guild, Craft Lane")
                    .city("Bengaluru")
                    .state("Karnataka")
                    .postalCode("560001")
                    .roles(new HashSet<>(Arrays.asList(Role.ROLE_ADMIN, Role.ROLE_SELLER)))
                    .build();
            adminUser = userRepository.save(adminUser);
        } else {
            adminUser = userRepository.findByEmail("admin@swayamcraft.com").get();
        }

        User customerUser = null;
        if (!userRepository.existsByEmail("customer@swayamcraft.com")) {
            customerUser = User.builder()
                    .fullName("Priya Sharma")
                    .email("customer@swayamcraft.com")
                    .password(passwordEncoder.encode("Customer@123"))
                    .phone("+91 91234 56789")
                    .address("Apt 302, Green Meadows")
                    .city("Bengaluru")
                    .state("Karnataka")
                    .postalCode("560034")
                    .roles(Collections.singleton(Role.ROLE_CUSTOMER))
                    .build();
            customerUser = userRepository.save(customerUser);
        } else {
            customerUser = userRepository.findByEmail("customer@swayamcraft.com").get();
        }

        // 2. Seed Categories
        Category candleCat = getOrCreateCategory(
                "Handcrafted Candles",
                "handcrafted-candles",
                "100% natural soy wax, essential oil blends, and hand-poured artisan candles designed for warmth and aromatherapy.",
                "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
                1
        );

        Category resinCat = getOrCreateCategory(
                "Ocean & Floral Resin Art",
                "resin-art",
                "High-clarity epoxy resin artistry incorporating real pressed botanicals, gold leaf, and shimmering ocean shorelines.",
                "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80",
                2
        );

        Category hamperCat = getOrCreateCategory(
                "Curated Gift Hampers",
                "curated-gift-hampers",
                "Luxuriously packaged gift sets combining artisanal candles, resin bookmarks, matching matchboxes, and dried floral bouquets.",
                "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
                3
        );

        Category customCat = getOrCreateCategory(
                "Custom Keepsakes",
                "custom-keepsakes",
                "Personalized resin nameplates, keepsake photo frames, and customized milestone gifts.",
                "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
                4
        );

        // 3. Seed Products if catalog is empty
        if (productRepository.count() == 0) {
            Product p1 = Product.builder()
                    .title("Midnight French Lavender & Vanilla Soy Candle")
                    .description("Hand-poured 100% soy candle infused with calming Provence lavender, warm Madagascar vanilla beans, and cedarwood undertones. Poured into an amber glass jar with a crackling wooden wick.")
                    .category(candleCat)
                    .price(new BigDecimal("799.00"))
                    .discountPrice(new BigDecimal("649.00"))
                    .stockQuantity(24)
                    .fragranceNotes("Lavender Blossoms, Warm Vanilla Bean, Subtle Cedar")
                    .burnTime("50 Hours")
                    .dimensions("8cm x 8cm x 9cm (220g)")
                    .isCustomizable(true)
                    .tags("candles, lavender, aromatherapy, relaxation, gift for her")
                    .isFeatured(true)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            Product p2 = Product.builder()
                    .title("Golden Sandalwood & Amber Bubble Candle Set")
                    .description("A duo of aesthetic geometric bubble candles crafted with vegan soy wax blend. Delivers a rich, earthy sandalwood and warm golden amber throw even when unlit.")
                    .category(candleCat)
                    .price(new BigDecimal("599.00"))
                    .discountPrice(new BigDecimal("499.00"))
                    .stockQuantity(30)
                    .fragranceNotes("Mysore Sandalwood, Golden Amber, Cashmere")
                    .burnTime("25 Hours each")
                    .dimensions("6cm x 6cm x 6cm each")
                    .isCustomizable(true)
                    .tags("candles, aesthetic, bubble candle, home decor, modern gift")
                    .isFeatured(true)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1572726729437-373d66455744?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            Product p3 = Product.builder()
                    .title("Ocean Waves 3D Resin Serving Platter & Coasters")
                    .description("Handmade resin serving board with acacia wood base, capturing multiple layered cyan ocean waves with realistic sea foam. Includes four matching resin wave coasters.")
                    .category(resinCat)
                    .price(new BigDecimal("2299.00"))
                    .discountPrice(new BigDecimal("1899.00"))
                    .stockQuantity(12)
                    .resinDetails("Multi-layered food-safe epoxy resin with white cell pigments and acacia wood")
                    .dimensions("38cm x 22cm Platter + 10cm Coasters")
                    .isCustomizable(true)
                    .tags("resin, ocean art, serving tray, housewarming gift, wedding gift")
                    .isFeatured(true)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            Product p4 = Product.builder()
                    .title("Pressed Botanical & Gold Flake Resin Coaster Set of 4")
                    .description("Delicate real pressed hydrangeas, baby's breath, and shimmering 24k gold leaf flakes preserved in crystal-clear hexagonal resin coasters with smooth polished edges.")
                    .category(resinCat)
                    .price(new BigDecimal("1199.00"))
                    .discountPrice(new BigDecimal("999.00"))
                    .stockQuantity(18)
                    .resinDetails("UV-resistant crystal clear epoxy resin, real dried floral petals, gold flakes")
                    .dimensions("10cm x 10cm x 0.8cm (Set of 4)")
                    .isCustomizable(true)
                    .tags("resin, floral, coasters, gold leaf, bridesmaid gift")
                    .isFeatured(true)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            Product p5 = Product.builder()
                    .title("Ceramic Mug, Roasted Coffee Candle & Resin Bookmark Hamper")
                    .description("The ultimate comfort gifting bundle: includes a handmade ceramic mug, a dark roast coffee & hazelnut soy candle in a tin, and an amber swirl resin bookmark with silk tassel.")
                    .category(hamperCat)
                    .price(new BigDecimal("1699.00"))
                    .discountPrice(new BigDecimal("1449.00"))
                    .stockQuantity(15)
                    .fragranceNotes("Dark Roasted Arabica, Warm Hazelnut, Caramel")
                    .burnTime("35 Hours")
                    .dimensions("Deluxe matte gift box: 26cm x 20cm x 10cm")
                    .isCustomizable(true)
                    .tags("gift hamper, coffee lover, candle, resin bookmark, birthday gift")
                    .isFeatured(true)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            Product p6 = Product.builder()
                    .title("Customized Resin Nameplate & Dried Floral Wall Clock")
                    .description("A bespoke 12-inch circular wall clock featuring personalized gold calligraphy names, real preserved pink daisies, and gold roman numeral indices.")
                    .category(customCat)
                    .price(new BigDecimal("2899.00"))
                    .discountPrice(new BigDecimal("2499.00"))
                    .stockQuantity(8)
                    .resinDetails("Silent sweep quartz movement, hand-poured resin on MDF base, gold vinyl lettering")
                    .dimensions("30cm (12 inch) diameter")
                    .isCustomizable(true)
                    .tags("customized, wall clock, anniversary gift, wedding gift, keepsake")
                    .isFeatured(true)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
                            "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            Product p7 = Product.builder()
                    .title("Wild Rose & Peony Scented Soy Candle in Ceramic Jar")
                    .description("Delicate floral notes of freshly picked English roses, pink peonies, and soft white musk. Reusable artisanal ribbed ceramic jar.")
                    .category(candleCat)
                    .price(new BigDecimal("849.00"))
                    .discountPrice(new BigDecimal("699.00"))
                    .stockQuantity(4) // Low stock demo item
                    .fragranceNotes("Damask Rose, Blooming Peony, Sheer Musk")
                    .burnTime("40 Hours")
                    .dimensions("9cm x 9cm x 8cm")
                    .isCustomizable(true)
                    .tags("candles, floral, rose, luxury candle, low stock")
                    .isFeatured(false)
                    .images(List.of(
                            "https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=800&q=80"
                    ))
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7));

            // 4. Seed a completed order for reporting & analytics preview
            if (orderRepository.count() == 0 && customerUser != null) {
                OrderItem item1 = OrderItem.builder()
                        .product(p1)
                        .quantity(1)
                        .priceAtPurchase(p1.getDiscountPrice())
                        .customGiftMessage("Happy 25th Anniversary Mom & Dad! With lots of love.")
                        .build();

                OrderItem item2 = OrderItem.builder()
                        .product(p4)
                        .quantity(1)
                        .priceAtPurchase(p4.getDiscountPrice())
                        .customGiftMessage(null)
                        .build();

                Order sampleOrder = Order.builder()
                        .orderNumber("SWY-DEMO-1001")
                        .user(customerUser)
                        .totalAmount(new BigDecimal("1698.00"))
                        .shippingFee(BigDecimal.ZERO)
                        .giftWrapFee(new BigDecimal("50.00"))
                        .status(OrderStatus.CRAFTING)
                        .paymentStatus(PaymentStatus.PAID)
                        .paymentMethod(PaymentMethod.UPI)
                        .recipientName("Ramesh & Sunita Sharma")
                        .shippingAddress("Flat 401, Palm Grove Enclave, Indiranagar")
                        .city("Bengaluru")
                        .state("Karnataka")
                        .postalCode("560038")
                        .contactPhone("+91 98450 11223")
                        .giftNoteCard("Wishing you both a lifetime of warmth and happiness together!")
                        .trackingNumber("TRK-SWY-88392")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build();

                item1.setOrder(sampleOrder);
                item2.setOrder(sampleOrder);
                sampleOrder.setItems(List.of(item1, item2));

                orderRepository.save(sampleOrder);
            }
        }
    }

    private Category getOrCreateCategory(String name, String slug, String description, String imageUrl, int order) {
        return categoryRepository.findBySlug(slug).orElseGet(() ->
                categoryRepository.save(Category.builder()
                        .name(name)
                        .slug(slug)
                        .description(description)
                        .imageUrl(imageUrl)
                        .displayOrder(order)
                        .isActive(true)
                        .build())
        );
    }
}
