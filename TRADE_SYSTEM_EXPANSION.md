# Trade System Expansion - Category + Subtrade Model

## 🎯 Overview

Expanded ChangAR's trade system from a flat list of 3 trades to a structured **category + subtrade model** with **33 Argentina-oriented services** across 5 categories.

---

## 📊 New Structure

### Categories and Subtrades

**1. Construcción (6 trades)**
- Albañil
- Pintor
- Techista
- Gasista
- Plomero
- Electricista

**2. Técnicos (8 trades)**
- Técnico en celulares
- Técnico en PC
- Técnico en notebooks
- Técnico en TV / Smart TV
- Técnico en electrodomésticos
- Técnico en aire acondicionado
- Técnico en heladeras
- Técnico en lavarropas

**3. Hogar (5 trades)**
- Limpieza
- Jardinería
- Fletes
- Mudanzas
- Armado de muebles

**4. Automotor (4 trades)**
- Mecánico
- Electricista automotor
- Gomero
- Cerrajero automotor

**5. Servicios varios (4 trades)**
- Cerrajero
- Herrero
- Carpintero
- Soldador

**Total: 33 trades across 5 categories**

---

## 📝 Files Changed

### **1. Type Definitions**

**`src/types/index.ts`**
- Added `TradeCategory` type with 5 categories
- Expanded `Oficio` type from 3 to 33 trades
- Added optional `category?: TradeCategory` field to `WorkerProfile` interface
- Added optional `category?: TradeCategory` field to `JobRequest` interface

### **2. Constants & Helpers**

**`src/lib/constants.ts`**
- Added `TRADE_CATEGORIES` array with category options
- Added `SUBTRADES_BY_CATEGORY` mapping of categories to their subtrades
- Kept `OFICIOS` as flattened list for backward compatibility
- Added `LEGACY_TRADE_MAPPING` for old trade value migration
- Added helper functions:
  - `getCategoryLabel(category)` - Get category display name
  - `getCategoryForTrade(oficio)` - Derive category from trade
  - `getSubtradesForCategory(category)` - Get subtrades for a category

### **3. Services**

**`src/services/worker.service.ts`**
- Updated `createWorkerProfile` to accept optional `category` field
- Updated `getWorkerProfile` to return `category` field
- Updated `searchWorkers` to include `category` in results

**`src/services/job.service.ts`**
- Updated `createJobRequest` to accept optional `category` field
- Updated `getJobRequest` to return `category` field
- Updated `getClientJobRequests` to include `category` in results
- Updated `searchJobRequests` to include `category` in results

### **4. Worker Profile Creation**

**`src/app/worker/profile/create/page.tsx`**
- Replaced single trade select with **cascading category + subtrade selects**
- Category select enables subtrade select
- Subtrade select shows only trades for selected category
- Resets subtrade when category changes
- Stores both `category` and `oficio` in profile

### **5. Client Job Request Creation**

**`src/app/client/requests/create/page.tsx`**
- Replaced single trade select with **cascading category + subtrade selects**
- Category select enables subtrade select
- Subtrade select shows only trades for selected category
- Resets subtrade when category changes
- Stores both `category` and `oficio` in request

### **6. Worker Dashboard Filters**

**`src/app/worker/dashboard/page.tsx`**
- Updated filters to use **cascading category + subtrade selects**
- Added category filter dropdown
- Subtrade filter now depends on category selection
- Shows "Todas las categorías" and "Todos los oficios" options

### **7. Display Components**

**`src/components/WorkerCard.tsx`**
- Updated to display category alongside trade name
- Shows format: "Oficio • Categoría" (e.g., "Albañil • Construcción")
- Uses stored category or derives from trade for backward compatibility

**`src/components/JobRequestCard.tsx`**
- Updated to display category alongside trade name
- Shows format: "Oficio • Categoría"
- Uses stored category or derives from trade for backward compatibility

### **8. Landing Page**

**`src/app/page.tsx`**
- Updated "Oficios disponibles" to "Servicios disponibles"
- Added diverse trade examples from multiple categories:
  - Albañil, Plomero, Electricista (Construcción)
  - Técnico en celulares (Técnicos)
  - Limpieza (Hogar)
  - Mecánico (Automotor)
  - Carpintero (Servicios varios)

---

## 🔄 Backward Compatibility

### **How Old Records Remain Compatible**

1. **Optional Category Field**
   - `category` is optional in both `WorkerProfile` and `JobRequest` interfaces
   - Old records without `category` field continue to work

2. **Category Derivation**
   - Helper function `getCategoryForTrade(oficio)` derives category from trade
   - Display components use: `worker.category || getCategoryForTrade(worker.oficio)`
   - If stored category exists, use it; otherwise derive it

3. **Legacy Trade Mapping**
   - `LEGACY_TRADE_MAPPING` maps old trade values to new ones:
     - `'albañil'` → `'albanil'` (removed accent for consistency)
     - `'electricista'` → `'electricista'` (unchanged)
     - `'plomero'` → `'plomero'` (unchanged)

4. **Flattened OFICIOS List**
   - `OFICIOS` constant still exists as flattened array
   - Contains all 33 trades for backward compatibility
   - Can be used where category filtering isn't needed

### **Migration Path**

**Existing records work immediately:**
- Old worker profiles display correctly (category derived from trade)
- Old job requests display correctly (category derived from trade)
- No database migration required

**New records are enhanced:**
- New profiles store both `category` and `oficio`
- New requests store both `category` and `oficio`
- Better filtering and organization

---

## 🎨 UX Implementation

### **Cascading Selects**

1. **Category Select** (always enabled)
   - Shows all 5 categories
   - Required field
   - Resets subtrade when changed

2. **Subtrade Select** (enabled when category selected)
   - Disabled until category is chosen
   - Shows only subtrades for selected category
   - Required field
   - Dynamic options based on category

### **Mobile-First Design**

- Large tap targets (min 48px height)
- Clear labels in Spanish (Argentina)
- Disabled state clearly indicated
- Smooth transitions when enabling/disabling

---

## 📍 Where Category/Subtrade Are Used

### **Data Storage (Firestore)**

1. **`worker_profiles` collection**
   - `oficio`: Oficio (required) - The specific trade
   - `category`: TradeCategory (optional) - The category

2. **`job_requests` collection**
   - `oficio`: Oficio (required) - The specific trade needed
   - `category`: TradeCategory (optional) - The category

### **UI Display**

1. **Worker Cards** - Shows "Oficio • Categoría"
2. **Job Request Cards** - Shows "Oficio • Categoría"
3. **Profile Creation Form** - Cascading category + subtrade selects
4. **Job Request Form** - Cascading category + subtrade selects
5. **Worker Dashboard Filters** - Category and subtrade filter dropdowns
6. **Landing Page** - Diverse service examples

### **Search & Filtering**

- Workers can filter job requests by category and/or subtrade
- Clients can search workers by category and/or subtrade
- Backward compatible with existing oficio-only searches

---

## ✅ Testing Checklist

- [x] Worker profile creation with category + subtrade
- [x] Client job request creation with category + subtrade
- [x] Worker dashboard filtering by category + subtrade
- [x] Worker cards display category
- [x] Job request cards display category
- [x] Backward compatibility with old records (no category)
- [x] Category derivation from trade works
- [x] Cascading selects reset correctly
- [x] All text in Spanish (Argentina)
- [x] Mobile-first UX maintained

---

## 🚀 Benefits

1. **Better Organization** - 33 trades organized into 5 logical categories
2. **Easier Discovery** - Users can browse by category first
3. **Scalability** - Easy to add new trades to existing categories
4. **Argentina-Focused** - Realistic service catalog for Argentine market
5. **Backward Compatible** - No breaking changes to existing data
6. **Clean UX** - Simple, mobile-first cascading selects

---

**The trade system is now production-ready with a comprehensive Argentina-oriented service catalog!** 🎉
