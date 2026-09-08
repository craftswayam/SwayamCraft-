# SwayamCraft 🕯️✨
### Artisanal Gifting & Handcrafted Treasures E-Commerce Platform

SwayamCraft is a full-stack e-commerce web platform designed for handmade and personalized gifting — specializing in **hand-poured soy wax candles**, **crystal resin art**, and **bespoke gift hampers**.

The system provides two distinct experiences:
1. **Customer Boutique**: Browse artisan catalog, filter by craft category, customize with personalized gift notes/engravings, slide-out gift bag with free delivery thresholds, seamless authentication prompt upon checkout, and multiple payment methods (UPI, Card, NetBanking, Cash on Delivery).
2. **Seller & Studio Hub (Admin Panel)**: Live sales reports & analytics, catalog management with image uploads, 1-click inline price fixing, stock adjustment, and order fulfillment status workflow (`CRAFTING`, `SHIPPED`, `DELIVERED`).

---

## 🛠️ Technology Stack

- **Backend**: Java 17, Spring Boot 3.3.3
  - **Security**: Spring Security 6 with stateless JWT authentication
  - **ORM**: Spring Data JPA & Hibernate
  - **Database (Development)**: H2 file-persisted database (`jdbc:h2:file:./data/swayamcraftdb`)
  - **Database (Production Ready)**: Pre-configured PostgreSQL profile (`application-prod.properties`)
  - **File Uploads**: Multi-part image storage service
- **Frontend**: React 18, Vite 5, Lucide Icons
  - **Styling**: Vanilla CSS Design System with warm artisanal luxury tokens (cream, terracotta, champagne gold, charcoal)
  - **Responsive Design**: Mobile-first with glassmorphic elements and micro-animations

---

## 🚀 Getting Started

### Prerequisites
- **Java**: JDK 17+
- **Maven**: 3.8+
- **Node.js**: v18+ and npm

### 1. Run Backend Service
```bash
cd backend
mvn spring-boot:run
```
- The backend API runs on: `http://localhost:8080`
- Embedded H2 Console: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/swayamcraftdb`
  - User: `sa` / Password: *(empty)*

### 2. Run Frontend Web App
```bash
cd frontend
npm install
npm run dev
```
- The frontend runs on: `http://127.0.0.1:5173`

---

## 🔑 Pre-Seeded Demo Accounts

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Artisan / Admin** | `admin@swayamcraft.com` | `Admin@123` | Full Seller & Admin Studio Hub, Reports, Catalog & Price Editing |
| **Demo Customer** | `customer@swayamcraft.com` | `Customer@123` | Customer Storefront, Cart, Gifting Personalization, Order History |

---

## 📦 Database Migration to PostgreSQL
To switch the application to PostgreSQL:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```
Set environment variables:
- `SPRING_DATASOURCE_URL=jdbc:postgresql://<host>:5432/<dbname>`
- `SPRING_DATASOURCE_USERNAME=<username>`
- `SPRING_DATASOURCE_PASSWORD=<password>`
