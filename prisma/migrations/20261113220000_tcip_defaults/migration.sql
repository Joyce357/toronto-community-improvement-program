-- TCIP-specific defaults: remove legacy Bridge of Compassion defaults.
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "category" SET DEFAULT 'Community';

-- AlterTable
ALTER TABLE "site_settings" ALTER COLUMN "organizationName" SET DEFAULT 'Toronto Community Improvement Program',
ALTER COLUMN "publicEmail" SET DEFAULT '',
ALTER COLUMN "footerTagline" SET DEFAULT 'Empowering Toronto newcomers, youth, and families through community programs, skill building, and collaborative advocacy.',
ALTER COLUMN "seoTitle" SET DEFAULT 'Toronto Community Improvement Program',
ALTER COLUMN "seoDescription" SET DEFAULT 'Toronto Community Improvement Program supports newcomers, youth, families, and underserved communities through education, empowerment, advocacy, and community development initiatives.';
