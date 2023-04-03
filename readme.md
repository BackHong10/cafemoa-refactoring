# 1등이조 - CafeMoa

<p align="center">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212879841-354fda8e-b566-49eb-85cc-b305843ccce6.png">
</p>

<br><br>

# CafeMoa 소개

**카페모아**의 기획 의도는 지난 10년간
프랜차이즈 및 개인카페들이 우후죽순으로 늘어나고 있습니다.

개인카페, 동네 카페의 경우에는 다른 커피점들과는 달리 뚜렷한 홍보수단이 없어 어려움을 겪고,
프랜차이즈에 밀려 폐업을 하기도 한다.

그래서 이 카페들을 위한 홍보망을 구축하고, 이 사이트를 사용하는 고객들은 쿠폰서비스를 제공받아
이득을 얻을 수 있도록 하기 위해 이 서비스를 기획하고, 개발을 하게 되었습니다.

# 배포주소

** CafeMoa ** : https://cafemoa.shop

<br><br>

# 팀원소개

<p align="center">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212874301-21959fd3-d114-4cb3-a6bd-498cadf955af.png">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212874414-d37f8b41-6c29-4be1-8d5e-77a65bb45afa.png">
</p>

# 기술스택

<p align="center">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212874771-fd214c1a-4189-40b7-a50a-1f773392bcea.png">
</p>

# Data Flow

<p align="center">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212875029-999a18ff-d389-4e72-8dbf-0aef8a38c579.png">
</p>

# ERD

<p align="center">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212875248-78dc068e-da83-4d27-91df-a9ad6352839d.png">
</p>

# API-DOCS

<p align="center">
<img width="60%" src="https://user-images.githubusercontent.com/90763140/212875454-f47ed15d-47f3-41b9-99e2-2f83826c999c.png">
</p>

# 서버 폴더구조

```
├── Dockerfile
├── Dockerfile.nginx
├── Dockerfile.prod
├── docker-compose.prod.yaml
├── docker-compose.yaml
├── nest-cli.json
├── nginx.default.conf
├── package.json
├── readme.md
├── src
│   ├── apis
│   │   ├── cafeImage
│   │   │   ├── cafeImage.module.ts
│   │   │   ├── cafeImage.resolver.ts
│   │   │   ├── cafeImage.service.ts
│   │   │   └── entities
│   │   │       └── cafeImage.entity.ts
│   │   ├── cafeInform
│   │   │   ├── cafeInform.module.ts
│   │   │   ├── cafeInform.resolver.ts
│   │   │   ├── cafeInform.service.ts
│   │   │   ├── dto
│   │   │   │   ├── cafeinform.input.ts
│   │   │   │   └── updatecafeinform.input.ts
│   │   │   └── entities
│   │   │       └── cafeInform.entity.ts
│   │   ├── cafeTag
│   │   │   └── entities
│   │   │       └── cafeTag.entity.ts
│   │   ├── cafemenuimage
│   │   │   ├── cafemenuImage.module.ts
│   │   │   ├── cafemenuImage.resolver.ts
│   │   │   ├── cafemenuImage.service.ts
│   │   │   └── entities
│   │   │       └── cafemenuimage.entity.ts
│   │   ├── category
│   │   │   ├── category.module.ts
│   │   │   ├── category.resolver.ts
│   │   │   ├── category.service.ts
│   │   │   └── entities
│   │   │       └── category.entity.ts
│   │   ├── comment
│   │   │   ├── comment.module.ts
│   │   │   ├── comment.resolver.ts
│   │   │   ├── comment.service.ts
│   │   │   ├── dto
│   │   │   │   ├── createComment.input.ts
│   │   │   │   └── updateComment.input.ts
│   │   │   └── entities
│   │   │       └── comment.entity.ts
│   │   ├── commentImage.ts
│   │   │   ├── commentimage.module.ts
│   │   │   ├── commentimage.resolver.ts
│   │   │   ├── commentimage.service.ts
│   │   │   └── entities
│   │   │       └── commentImage.entity.ts
│   │   ├── coupon
│   │   │   ├── coupon.module.ts
│   │   │   ├── coupon.resolver.ts
│   │   │   ├── coupon.service.ts
│   │   │   └── entities
│   │   │       └── coupon.entity.ts
│   │   ├── deletedcoupon
│   │   │   ├── deletedcoupon.module.ts
│   │   │   ├── deletedcoupon.resolver.ts
│   │   │   ├── deletedcoupon.service.ts
│   │   │   └── entities
│   │   │       └── deletedcoupon.entity.ts
│   │   ├── fileupload
│   │   │   ├── filesupload.module.ts
│   │   │   ├── filesupload.resolver.ts
│   │   │   ├── filesupload.service.ts
│   │   │   └── interfaces
│   │   │       └── files-service.interface.ts
│   │   ├── likeComment
│   │   │   └── entities
│   │   │       └── likecomment.entity.ts
│   │   ├── owner
│   │   │   ├── dto
│   │   │   │   ├── owner.input.ts
│   │   │   │   └── ownerUpdate.input.ts
│   │   │   ├── entities
│   │   │   │   └── owner.entity.ts
│   │   │   ├── owner.module.ts
│   │   │   ├── owner.resolver.ts
│   │   │   └── owner.service.ts
│   │   ├── ownerAuth
│   │   │   ├── ownerAuth.module.ts
│   │   │   ├── ownerAuth.resolver.ts
│   │   │   └── ownerAuth.service.ts
│   │   ├── ownercomment
│   │   │   ├── dto
│   │   │   │   ├── createownercomment.input.ts
│   │   │   │   └── updateownercomment.input.ts
│   │   │   ├── entities
│   │   │   │   └── ownercomment.entity.ts
│   │   │   ├── ownercomment.module.ts
│   │   │   ├── ownercomment.resolver.ts
│   │   │   └── ownercomment.service.ts
│   │   ├── pickList
│   │   │   ├── entities
│   │   │   │   └── pickList.entity.ts
│   │   │   ├── pickList.module.ts
│   │   │   ├── pickList.resolver.ts
│   │   │   └── pickList.service.ts
│   │   ├── stamp
│   │   │   ├── dto
│   │   │   │   └── stamp-create.input.ts
│   │   │   ├── entities
│   │   │   │   └── stamp.entity.ts
│   │   │   ├── stamp.module.ts
│   │   │   ├── stamp.resolver.ts
│   │   │   └── stamp.service.ts
│   │   ├── stamphistory
│   │   │   ├── entities
│   │   │   │   └── stamphistory.entity.ts
│   │   │   ├── stamphistory.module.ts
│   │   │   ├── stamphistory.resolver.ts
│   │   │   └── stamphistory.service.ts
│   │   ├── user
│   │   │   ├── dto
│   │   │   │   ├── user-create.input.ts
│   │   │   │   └── user-update.input.ts
│   │   │   ├── entities
│   │   │   │   └── user.entity.ts
│   │   │   ├── interfaces
│   │   │   │   └── user-service.interface.ts
│   │   │   ├── user.module.ts
│   │   │   ├── user.resolver.ts
│   │   │   └── user.service.ts
│   │   └── userauth
│   │       ├── interfaces
│   │       │   └── auth-service.interface.ts
│   │       ├── userauth.module.ts
│   │       ├── userauth.resolver.ts
│   │       └── userauth.service.ts
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── commons
│   │   ├── auth
│   │   │   ├── gql-auth.guard.ts
│   │   │   ├── jwt-access.strategy.ts
│   │   │   └── jwt-refresh.strategy.ts
│   │   ├── graphql
│   │   │   └── schema.gql
│   │   └── types
│   │       └── context.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock
```

# .env

```
DATABASE_DATABASE
DATABASE_HOST
DATABASE_PASSWORD
DATABASE_PORT
DATABASE_TYPE
DATABASE_USERNAME
EMAIL_PASS
EMAIL_SENDER
EMAIL_USER
JWT_ACCESS_KEY
JWT_REFRESH_KEY
SMS_KEY
SMS_SECRET
SMS_SENDER

```
