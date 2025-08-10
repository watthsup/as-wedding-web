# FROM node:20-alpine AS development-dependencies-env
# COPY . /app
# WORKDIR /app
# RUN npm ci

# FROM node:20-alpine AS production-dependencies-env
# COPY ./package.json package-lock.json /app/
# WORKDIR /app
# RUN npm ci --omit=dev

# FROM node:20-alpine AS build-env
# COPY . /app/
# COPY --from=development-dependencies-env /app/node_modules /app/node_modules
# WORKDIR /app
# RUN npm run build

# FROM node:20-alpine
# COPY ./package.json package-lock.json /app/
# COPY --from=production-dependencies-env /app/node_modules /app/node_modules
# COPY --from=build-env /app/build /app/build
# WORKDIR /app
# CMD ["npm", "run", "start"]

# ใช้ Node 20 บน Alpine (ขนาดเล็ก)
FROM node:20-alpine AS pnpm-base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app
# เปิดใช้ Corepack เพื่อให้ pnpm ทำงานตาม packageManager ของโปรเจกต์
RUN corepack enable pnpm

# 1) เตรียม dependency cache จาก lockfile (fetch เท่านั้น ยังไม่ติดตั้ง)
FROM pnpm-base AS deps-cache
COPY pnpm-lock.yaml package.json ./
# ดึงแพ็กเกจเข้าสตอร์กลาง (จะเร็ว และ cacheable)
RUN pnpm fetch --store-dir /pnpm-store

# 2) ติดตั้ง dependencies ทั้งหมด (รวม dev) สำหรับขั้นตอน build
FROM pnpm-base AS dev-deps
COPY --from=deps-cache /pnpm-store /pnpm-store
COPY pnpm-lock.yaml package.json ./
# ติดตั้งจากสโตร์แบบออฟไลน์ให้ตรงกับ lockfile 100%
RUN pnpm install --frozen-lockfile --offline --store-dir /pnpm-store

# 3) Build โค้ด
FROM pnpm-base AS build
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
# สั่ง build ตามสคริปต์ใน package.json (เช่น Vite/Next/CRA)
RUN pnpm run build

# 4) ติดตั้งเฉพาะ Production deps เพื่อลดขนาดอิมเมจรันจริง
FROM pnpm-base AS prod-deps
COPY --from=deps-cache /pnpm-store /pnpm-store
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile --offline --prod --store-dir /pnpm-store

# 5) รูปสุดท้ายสำหรับรันจริง
FROM node:20-alpine
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app
# เปิดใช้ Corepack เพื่อให้ pnpm ทำงาน
RUN corepack enable pnpm

# คัดลอกไฟล์ที่ต้องใช้ตอนรัน
COPY package.json pnpm-lock.yaml ./
COPY --from=prod-deps /app/node_modules ./node_modules
# React Router v7 สร้างไฟล์ build ในโฟลเดอร์ build
COPY --from=build /app/build ./build

# Expose port 3000
EXPOSE 3000

# รัน React Router server ผ่าน pnpm script
CMD ["pnpm", "run", "start"]