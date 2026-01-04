-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('text', 'number', 'date', 'checkbox', 'single_select', 'multi_select', 'link', 'formula', 'lookup', 'rollup', 'attachment');

-- CreateTable
CREATE TABLE "Base" (
    "id" TEXT NOT NULL,
    "base_name" TEXT NOT NULL DEFAULT 'default base',
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Base_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" TEXT NOT NULL,
    "base_id" TEXT NOT NULL,
    "table_name" TEXT NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "order_index" INTEGER NOT NULL,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Row" (
    "id" TEXT NOT NULL,
    "table_id" TEXT NOT NULL,

    CONSTRAINT "Row_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "row_id" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);
