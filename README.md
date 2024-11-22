간소화된 DDD 예제


남은 작업 auth 추가(인증 및 캐시-jwt, )
response form 추가

하나의 도메인에서 1:N 관계 처리 방법
- 하위 데이터의 등록/수정/삭제는 별도의 service, repository 에서 처리 합니다.
  -> 이유: 하위데이터 수정 작업 시 분기처리가 entity 내에서 처리하는게 너무 복잡 합니다.
  -> 단점: 등록/수정 시 메인데이터만 조회 됩니다. 별도의 조회 쿼리가 서비스 layer에 있어야 합니다.
- 상위 데이터에서 하위 데이터 조회 시 repository에서 include로 처리 합니다.

---
`pnpm install @prisma/client prisma`
`pnpm install @nestjs/config`
