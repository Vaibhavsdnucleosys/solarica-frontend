# Backend Changes Report

## Feature: Quotation Field Syncing & Schema Update

**Date:** 2025-12-30

### 1. Brief Summary
The backend system was updated to ensure full syncing of quotation form data. Previously, some client-specific fields (like `consumerNumber`, `gstNumber`) were not being saved to the database during quotation creation. The database schema and API endpoints were modified to accept, validate, and persist these fields, ensuring data integrity.

### 2. Detailed Technical Explanation

#### Problem
The `createQuotation` API endpoint initially accepted only a subset of fields (Company Name, Email, Phone, System Capacity). As the frontend form evolved to include detailed customer information (Consumer Number, GST Number, Subsidy Details), this data was being sent in the payload but ignored by the backend, leading to data loss on saved quotations.

#### Solution
1.  **Schema Update**: The database model (`Quotation`) was extended to include columns for all new frontend fields.
2.  **Controller Update**: The `createQuotation` controller was updated to destructure these new fields from the request body.
3.  **Model Service Update**: The `createQuotationModel` function signature was expanded to accept these new arguments and pass them to the Prisma `create` call.

### 3. Code Modifications

#### A. Database Model & Service (`src/api/model/quotation.model.ts`)
The `createQuotationModel` function was updated to accept new arguments and map them to the Prisma schema.

**Updated Function Signature:**
```typescript
export const createQuotationModel = async (
  // ... existing fields ...
  companyName: string,
  systemCapacityKw: number,
  
  // [NEW] Added Fields support
  consumerNumber?: string,
  BillingNumber?: string,
  CustomerNumber?: string,
  gstNumber?: string,
  customerType?: string,
  subsidyType?: string,
  onGrid?: string,
  phase?: string,
  gstRate?: number,
  numberOfFlats?: number,
  gstAmount?: number,
  totalAmount?: number,
  subsidyAmount?: number,
  netPayableAmount?: number,
  validityDays?: number
) => {
    // ... validation logic ...

    const quotation = await tx.quotation.create({
      data: {
        // ... mappings ...
        consumerNumber,
        BillingNumber,
        CustomerNumber,
        gstNumber,
        customerType,
        subsidyType,
        phase,
        numberOfFlats,
        netPayableAmount: netPayableAmount || 0,
        // ...
      }
    });
    // ...
};
```

#### B. API Controller (`src/api/controller/quotation.controller.ts`)
The `createQuotation` handler was updated to extract these fields from `req.body` and pass them to the model.

**Updated Logic:**
```typescript
export const createQuotation = async (req: Request, res: Response) => {
    // [NEW] Destructuring new fields from request body
    const {
      companyName,
      // ...
      consumerNumber,
      BillingNumber,
      CustomerNumber,
      gstNumber,
      customerType,
      subsidyType,
      onGrid,
      phase,
      gstRate,
      numberOfFlats,
      gstAmount,
      totalAmount,
      subsidyAmount,
      netPayableAmount,
      validityDays
    } = req.body;

    // [NEW] Passing fields to service
    const quotation = await createQuotationModel(
      companyName,
      // ...
      consumerNumber,
      BillingNumber,
      CustomerNumber,
      gstNumber,
      customerType,
      subsidyType,
      onGrid,
      phase,
      gstRate,
      numberOfFlats,
      gstAmount,
      totalAmount,
      subsidyAmount,
      netPayableAmount,
      validityDays
    );
    
    // ...
};
```
