## Future Components and Hooks

This directory contains implementations that are planned for future use but are not currently integrated into the application.

### Contents

- `hooks/useSectionOrder.ts`: Generic section ordering hook for use across different views
- `components/shared/SectionOrderManager.tsx`: Generic draggable section order manager component

### Integration Plan

These components will be used when we need to implement section ordering across multiple views like:
- Family View
- Company View
- Asset View
- Contact View

### Usage Example

```typescript
// Example future usage in CompanyView
const CompanyView: React.FC = () => {
  const { sectionOrder, moveSection, resetToDefault, orderSections } = 
    useSectionOrder<CompanySection>(
      user?.id || 'default',
      'company',
      DEFAULT_COMPANY_SECTION_ORDER
    );

  return (
    <div>
      <SectionOrderManager
        sectionOrder={sectionOrder}
        sectionTitles={COMPANY_SECTION_TITLES}
        onMove={moveSection}
        onReset={resetToDefault}
      />
      {/* Rest of view */}
    </div>
  );
};
```

### TODO
- [ ] Add tests for generic section ordering
- [ ] Create migration plan for existing views
- [ ] Add documentation for view-specific implementations