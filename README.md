# schedulerforpets

🐾 애견 미용 예약 앱 풀스택 설계

📁 프로젝트 구조
/pet-grooming-app
├── /mobile # React Native 앱
│ ├── /src
│ │ ├── /screens
│ │ ├── /components
│ │ ├── /hooks # React Query hooks
│ │ ├── /store # Zustand stores
│ │ └── /api # API 클라이언트
│
└── /backend # NestJS 서버
├── /src
│ ├── /auth
│ ├── /users
│ ├── /pets
│ ├── /reservations
│ └── /groomers
└── /migrations
