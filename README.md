# Library App BE (ExpressJS)

Backend sederhana untuk aplikasi katalog buku menggunakan ExpressJS.

---

## Fitur
 
- Endpoint CRUD (Create, Read, Update, Delete)  
- Menggunakan database dengan migration  
- Terintegrasi dengan frontend (Next.js)  

---

## Tech Stack

- Node.js  
- ExpressJS  
- Database (MySQL / PostgreSQL)  

---

## Instalasi dan Menjalankan Project

```bash
git clone https://github.com/dandyj18/library-be.git
cd library-be
npm install

# jalankan migration (WAJIB)
npm run migrate
# atau:
# npx sequelize db:migrate

# jalankan server
npm run dev
