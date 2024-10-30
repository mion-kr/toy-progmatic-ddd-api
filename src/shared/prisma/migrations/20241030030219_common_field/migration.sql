-- USER 테이블 필드 이름 변경
ALTER TABLE "user"."USER" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "user"."USER" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "user"."USER" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "user"."USER" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "user"."USER" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "user"."USER" RENAME COLUMN "deletedBy" TO "deleted_by";

-- CODE 테이블 필드 이름 변경
ALTER TABLE "common"."CODE" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "common"."CODE" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "common"."CODE" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "common"."CODE" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "common"."CODE" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "common"."CODE" RENAME COLUMN "deletedBy" TO "deleted_by";

-- CODE_GROUP 테이블 필드 이름 변경
ALTER TABLE "common"."CODE_GROUP" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "common"."CODE_GROUP" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "common"."CODE_GROUP" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "common"."CODE_GROUP" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "common"."CODE_GROUP" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "common"."CODE_GROUP" RENAME COLUMN "deletedBy" TO "deleted_by";

-- PARTNERS 테이블 필드 이름 변경
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "partners"."PARTNERS" RENAME COLUMN "deletedBy" TO "deleted_by";

-- PRODUCT 테이블 필드 이름 변경
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "product"."PRODUCT" RENAME COLUMN "deletedBy" TO "deleted_by";

-- PRODUCT_FISH 테이블 필드 이름 변경
ALTER TABLE "product"."PRODUCT_FISH" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "product"."PRODUCT_FISH" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "product"."PRODUCT_FISH" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "product"."PRODUCT_FISH" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "product"."PRODUCT_FISH" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "product"."PRODUCT_FISH" RENAME COLUMN "deletedBy" TO "deleted_by";

-- PAYMENT 테이블 필드 이름 변경
ALTER TABLE "reservation"."PAYMENT" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "reservation"."PAYMENT" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "reservation"."PAYMENT" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "reservation"."PAYMENT" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "reservation"."PAYMENT" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "reservation"."PAYMENT" RENAME COLUMN "deletedBy" TO "deleted_by";

-- RESERVATION 테이블 필드 이름 변경
ALTER TABLE "reservation"."RESERVATION" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "reservation"."RESERVATION" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "reservation"."RESERVATION" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "reservation"."RESERVATION" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "reservation"."RESERVATION" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "reservation"."RESERVATION" RENAME COLUMN "deletedBy" TO "deleted_by";

-- SCHEDULE 테이블 필드 이름 변경
ALTER TABLE "schedule"."SCHEDULE" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "schedule"."SCHEDULE" RENAME COLUMN "createdBy" TO "created_by";
ALTER TABLE "schedule"."SCHEDULE" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "schedule"."SCHEDULE" RENAME COLUMN "updatedBy" TO "updated_by";
ALTER TABLE "schedule"."SCHEDULE" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "schedule"."SCHEDULE" RENAME COLUMN "deletedBy" TO "deleted_by";