# Smart Vet Management

ระบบจัดการคลินิกสัตว์เลี้ยง (Smart Vet Management) ที่พัฒนาด้วยสถาปัตยกรรมที่รองรับการขยายตัว (Scalability) และเน้นความถูกต้องของข้อมูล (No Double Booking)

## 🛠 Tech Stack

**Frontend:**
- Next.js (App Router)
- Vanilla CSS / CSS Modules
- ฟีเจอร์: หน้าจอปฏิทินนัดหมาย (Calendar View), ระบบลงทะเบียนสัตว์เลี้ยง

**Backend:**
- Node.js & Express.js
- โครงสร้างแบบ Group by Type (Controllers, Services, Models, Routes)
- ฟีเจอร์: RESTful API, ระบบป้องกันการจองคิวซ้อนด้วย Database Transaction

**Database:**
- PostgreSQL (ใช้ความสามารถของ Transaction และ Locking จัดการ Concurrency)
- Sequelize (ORM)

**Testing:**
- Jest & Supertest
- มีชุดทดสอบ Concurrency Test เพื่อจำลองสถานการณ์การแย่งกันจองคิวในเวลาเดียวกัน (Race Condition)

**Deployment:**
- Docker & Docker Compose

## 🚀 วิธีการติดตั้งและรันระบบ (Development)

ระบบนี้ใช้ Docker Compose ในการจำลองสภาพแวดล้อมทั้งหมด (Frontend, Backend, Database) ให้พร้อมใช้งานทันที

### Prerequisites (ข้อกำหนดเบื้องต้น)
- ติดตั้ง [Docker Desktop](https://www.docker.com/products/docker-desktop/) ในเครื่องของคุณ

### ขั้นตอนการรัน

1. เปิด Terminal และเข้าไปที่โฟลเดอร์โปรเจ็ค
2. รันคำสั่งด้านล่างเพื่อเริ่มการทำงานของทุก Services ใน Background:
   ```bash
   docker-compose up -d --build
   ```
3. เมื่อรันเสร็จเรียบร้อย ระบบจะเปิดให้บริการดังนี้:
   - **Frontend (Web App):** http://localhost:3000
   - **Backend (API):** http://localhost:5000
   - **PostgreSQL Database:** พอร์ต `5432`

4. (ตัวเลือก) หากต้องการดู Logs ของระบบ:
   ```bash
   docker-compose logs -f
   ```

5. วิธีปิดระบบ:
   ```bash
   docker-compose down
   ```

## 🧪 วิธีการรัน Automated Tests

เพื่อทดสอบความถูกต้องของระบบ โดยเฉพาะส่วนของ No Double Booking:

1. เข้าไปที่โฟลเดอร์ Backend
   ```bash
   cd backend
   ```
2. รันคำสั่ง Test
   ```bash
   npm run test
   ```
ระบบจะทำการรัน Jest รวมไปถึง Concurrency Test ที่จำลองการกดจองพร้อมๆ กัน
