# BlueCV Builder — Implementation Plan

## 1. Project Overview

### Project Name

BlueCV Builder

### Purpose

Build a modern, responsive, client-side CV Builder application that allows users to select professionally designed CV templates, enter personal and career information, upload a profile photo, preview their CV in real time, populate the form with sample data, and export their CV as a print-ready PDF.

### Core Features

- Four unique CV templates.
- Dynamic CV form.
- Live CV preview.
- Profile photo upload.
- Sample data generator.
- Repeatable form sections.
- A4 PDF export.
- Responsive interface.
- Client-side data handling.
- No backend or database.

### Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- Native browser print functionality
- SVG for local placeholder assets

### Project Constraints

- No React, Vue, Angular, Svelte, or other frameworks.
- No Bootstrap, Tailwind, or UI frameworks.
- No backend.
- No database.
- No authentication.
- No build tools.
- No unnecessary external dependencies.
- Must work locally in a modern browser.

---

## 2. Design System & UI/UX

### Design Direction

Create a premium, modern CV Builder interface inspired by professional SaaS products.

The UI should be:

- Clean
- Modern
- Professional
- Minimal
- Easy to navigate
- Responsive
- Visually consistent

### Color Palette

Primary Blue:

- \#2563EB

Primary Dark:

- \#1D4ED8

Primary Light:

- \#DBEAFE

Background:

- \#F8FAFC

Surface:

- \#FFFFFF

Main Text:

- \#0F172A

Secondary Text:

- \#64748B

Border:

- \#E2E8F0

Success:

- \#16A34A

Error:

- \#DC2626

### UI Components

- Header/navigation
- Logo and application title
- Progress indicator
- Template selection cards
- Form section cards
- Text inputs
- Textareas
- Select controls
- Date inputs
- Checkboxes
- Skill tags
- Repeatable entry cards
- Photo upload area
- Live CV preview
- Primary and secondary buttons
- Confirmation dialog
- Toast notifications
- Inline validation messages

### Typography

Use a modern, readable font stack with clear hierarchy.

Recommended:

- Inter if locally or externally available without making the app dependent on it.
- Otherwise use a system font stack.

### Interaction Design

- Smooth but restrained transitions.
- Clear hover states.
- Visible keyboard focus.
- Selected template state.
- Disabled states for unavailable actions.
- Reduced-motion support.
- No excessive animations.

---

## 3. Application Workflow

The application should follow this workflow:

### Step 1 — Template Selection

User selects one of four CV templates:

- Professional
- Modern
- Colorful
- Executive

### Step 2 — CV Information

User enters information in a structured form.

### Step 3 — Live Preview

User sees the selected CV template with their data.

### Step 4 — Edit / Review

User can go back, change data, switch templates, or refresh preview.

### Step 5 — Export

User clicks Download CV / Save as PDF and uses the browser print dialog to save the CV as PDF.

The CV data must remain intact when navigating between steps or changing templates.

---

## 4. CV Template Architecture

Implement four distinct templates using a shared CV data model.

All templates must use the same underlying user information. Changing a template must never clear, reset, or modify the user's entered CV data.

The templates must have genuinely different visual structures—not just different accent colors.

### 4.1 Professional Template

Purpose:
Corporate, traditional, ATS-friendly CV.

Design:

- White background.
- Blue accent color.
- Single-column layout.
- Clear name and job title header.
- Compact contact information.
- Strong section headings.
- Simple dividers.
- Consistent typography.
- Minimal decorative elements.
- No unnecessary graphics.

Sections:

- Name and job title
- Contact details
- Professional summary
- Work experience
- Education
- Skills
- Projects
- Certifications
- Languages
- Optional sections

This template should prioritize readability, ATS friendliness, and professional job applications.

### 4.2 Modern Template

Purpose:
Contemporary, minimalist, stylish CV for modern professional roles.

Design:

- Modern typography.
- Spacious layout.
- Strong typographic hierarchy.
- Subtle blue accents.
- Clean section separators.
- Stylish contact-information presentation.
- Carefully balanced whitespace.
- Modern header layout.

Possible layout:

- Large name and title area.
- Contact details arranged in a compact row or grid.
- Skills displayed as visually organized tags.
- Experience and education presented with clear timeline styling.

The template must feel visually distinct from the Professional template while remaining suitable for formal job applications.

### 4.3 Colorful Template

Purpose:
Creative CV suitable for designers, marketing professionals, creative roles, and personal portfolios.

Design:

- Colorful but tasteful palette.
- Colored sidebar or accent panels.
- Section heading accents.
- Skill badges.
- Distinctive header.
- Profile photo support.
- Creative layout.
- Carefully controlled color contrast.

Suggested colors:

- Blue
- Teal
- Violet
- Soft background colors

Possible layout:

- Left sidebar containing profile photo, contact details, skills, and languages.
- Main content area containing summary, experience, education, projects, and certifications.

Colors must remain readable and professional.

### 4.4 Executive Template

Purpose:
Premium CV for senior professionals, managers, executives, and leadership positions.

Design:

- Elegant layout.
- Dark navy accents.
- Premium typography.
- Strong header section.
- Restrained decorative lines.
- Sophisticated spacing.
- Professional contact-information layout.
- Leadership-focused presentation.

Suggested palette:

- Navy
- White
- Slate
- Muted blue
- Subtle gray

Possible layout:

- Large executive name.
- Prominent leadership title.
- Executive summary.
- Leadership achievements.
- Work experience.
- Education.
- Skills and expertise.
- Certifications and awards.

The Executive template must look premium and visually different from all other templates.

### 4.5 Template Architecture Requirements

- Use one shared CV data model.
- Create separate template rendering functions.
- Use template-specific CSS classes.
- Keep template styles isolated.
- Preserve user data when changing templates.
- Update the preview immediately after a template change.
- Ensure all templates support the same available CV information.
- Hide empty sections consistently.
- Ensure all templates work in print/PDF mode.

---

## 5. CV Data Model

Maintain one structured JavaScript state object as the single source of truth.

Suggested structure:

- personalInfo

  - fullName
  - jobTitle
  - email
  - phone
  - location
  - linkedin
  - website
  - photo

- summary

- experience[]

  - jobTitle
  - company
  - location
  - startDate
  - endDate
  - current
  - description

- education[]

  - degree
  - institution
  - location
  - startDate
  - endDate
  - description

- skills[]

- projects[]

  - name
  - description
  - link
  - technologies

- certifications[]

  - name
  - organization
  - date

- languages[]

  - name
  - proficiency

- awards[]

- interests[]

- references[]

- selectedTemplate

Requirements:

- Keep state consistent.
- Update state from user inputs.
- Render the preview from state.
- Never depend on the preview DOM as the data source.
- Switching templates must preserve state.
- Avoid unnecessary persistent storage.

---

## 6. Dynamic CV Form

Create a user-friendly form divided into logical sections.

### 6.1 Personal Information

Fields:

- Full name
- Professional title
- Email
- Phone
- Location
- LinkedIn
- Portfolio / website
- Profile photo

### 6.2 Professional Summary

- Professional summary textarea
- Career objective if applicable

### 6.3 Work Experience

Allow multiple experience entries.

Each entry:

- Job title
- Company
- Location
- Start date
- End date
- Currently working checkbox
- Responsibilities / achievements

Controls:

- Add Experience
- Remove Experience

### 6.4 Education

Allow multiple education entries.

Each entry:

- Degree
- Institution
- Location
- Start date
- End date
- Description

Controls:

- Add Education
- Remove Education

### 6.5 Skills

- Add skill input.
- Add skill button or Enter-key support.
- Display skills as tags.
- Remove individual skills.

### 6.6 Projects

Each entry:

- Project name
- Description
- Project URL
- Technologies used

Controls:

- Add Project
- Remove Project

### 6.7 Certifications

Each entry:

- Certification name
- Issuing organization
- Issue date

Controls:

- Add Certification
- Remove Certification

### 6.8 Languages

Each entry:

- Language name
- Proficiency

Controls:

- Add Language
- Remove Language

### 6.9 Optional Sections

Allow optional information:

- Awards
- Interests
- References

Requirements:

- Add and remove optional items.
- Hide empty sections in the preview.
- Repeatable controls must work correctly.
- Use unique IDs for dynamic entries.
- Use event delegation where appropriate.
- Associate labels correctly with inputs.
- Preserve entered values during navigation and template changes.

---

## 7. Sample Data Feature

Create a button:

Fill with Sample Data

When clicked:

- Populate all major form sections.
- Use fictional, realistic information.
- Include full name and professional title.
- Include contact details.
- Include a professional summary.
- Include at least two work experience entries.
- Include at least two education entries.
- Populate skills.
- Include multiple projects.
- Include certifications.
- Include languages.
- Populate optional sections when applicable.

### Sample Data Behavior

- Sample data should be realistic and professionally written.
- Use fictional contact information.
- Do not use real personal data.
- Update the form and preview immediately.
- Do not change the currently selected template.
- If the user has already entered data, show a confirmation dialog before replacing it.
- Provide Cancel and Confirm actions.
- Show a success notification after sample data is populated.

---

## 8. Profile Photo Upload

### Supported Formats

- JPG
- JPEG
- PNG
- WebP

### Maximum File Size

5 MB

### Features

- Upload photo.
- Preview uploaded photo.
- Replace photo.
- Remove photo.
- Display a placeholder when no photo exists.
- Support photo display in all four templates.
- Maintain appropriate cropping and aspect ratio.

### Validation

- Reject unsupported formats.
- Reject files larger than 5 MB.
- Show user-friendly error messages.
- Avoid breaking the preview when an invalid image is uploaded.

### Privacy

- Process the image locally in the browser.
- Do not upload the image to any server.
- Do not transmit image data over the network.

---

## 9. Live CV Preview

Create a dedicated CV preview area.

Requirements:

- Update the preview automatically when form fields change.
- Reflect changes to experience, education, skills, projects, certifications, languages, and optional sections.
- Update photo changes immediately.
- Hide empty sections.
- Display current employment as Present.
- Preserve the selected template.
- Render cleanly without overlapping content.
- Support long descriptions and multiple entries.
- Ensure safe rendering of user input.

### Preview Controls

- Edit Details
- Refresh Preview
- Change Template
- Download CV as PDF

### Preview Rendering

- Use safe DOM APIs.
- Use textContent for user-provided text.
- Do not inject user data through unsafe innerHTML.
- Keep rendering logic reusable across templates.
- Ensure empty data and missing fields do not create broken layouts.

---

## 10. PDF Export & Print System

Use native browser printing through window\.print().

Do not falsely claim direct PDF generation. The application will open the browser print dialog, where users can select Save as PDF.

### PDF Requirements

- A4 paper size.
- Portrait orientation.
- 1-inch margins on all four sides.
- 25.4 mm margins.
- White page background.
- Selectable text.
- High readability.
- Clean typography.
- Proper section spacing.
- Multi-page support.
- No clipped text.
- No overlapping content.
- Include profile photo if uploaded.
- Preserve template-specific design as much as possible.
- Generate a meaningful filename based on the user's name.

### Print CSS

Implement print-specific styles using @media print and @page.

Requirements:

- @page size A4 portrait.
- Margin: 25.4 mm.
- Hide application UI.
- Hide navigation.
- Hide buttons.
- Hide forms and editing controls.
- Hide template selection cards.
- Hide toast notifications.
- Print only the CV.
- Avoid fixed heights that clip content.
- Allow natural multi-page document flow.
- Use break-inside: avoid where appropriate.
- Do not force every section onto a new page.
- Avoid excessive page breaks.
- Preserve readable colors and text contrast.
- Prevent empty pages.
- Prevent unnecessary background printing dependencies.

### Filename

Create a professional filename based on the user's full name.

Example:
John_Doe_CV.pdf

If the name is empty, use:
My_CV.pdf

### PDF Verification

Verify:

- A4 portrait dimensions.
- 25.4 mm margins.
- Selectable text.
- Complete content.
- Correct page breaks.
- Photo inclusion.
- No clipped content.
- Professional appearance for all four templates.

---

## 11. Workflow & Navigation

Implement a step-based workflow.

Suggested stages:

1. Choose Template
2. Enter Information
3. Preview CV
4. Export PDF

### Navigation Controls

- Back
- Next
- Edit Details
- Change Template
- Refresh Preview
- Download CV as PDF
- Clear Form

### Requirements

- Display current step.
- Show progress.
- Prevent invalid navigation when necessary.
- Preserve form state.
- Provide clear instructions.
- Show confirmation before clearing all data.
- Avoid unnecessary page reloads.
- Keep navigation responsive and accessible.

---

## 12. Validation & Error Handling

Implement appropriate validation.

### Validation Rules

- Full name is required before exporting.
- Email must be valid if provided.
- Website and LinkedIn URLs must be valid if provided.
- Image type must be supported.
- Image size must not exceed 5 MB.
- Repeatable fields must handle empty entries.
- Invalid fields must display clear error messages.

### Error Handling

- Show inline validation.
- Show accessible status messages.
- Use toast notifications for success and general errors.
- Avoid silent failures.
- Do not lose valid data when an error occurs.

---

## 13. Accessibility

Requirements:

- Semantic HTML.
- Proper heading hierarchy.
- Accessible form labels.
- Keyboard-accessible template cards.
- Keyboard-accessible dialogs.
- Visible focus states.
- Appropriate ARIA attributes.
- Screen-reader-friendly status messages.
- Sufficient contrast.
- Respect prefers-reduced-motion.
- Do not rely only on color to indicate selection or errors.

---

## 14. Privacy & Data Handling

The application must operate locally.

Requirements:

- No backend.
- No database.
- No automatic cloud storage.
- No analytics.
- No external API calls.
- No form data transmission.
- No automatic persistence unless explicitly added later.

CV information should remain in browser memory during the current session.

If the user reloads or closes the browser, data may be lost. Clearly communicate this where appropriate.

---

## 15. Responsive Design

Support:

### Desktop

1440px and above:

- Spacious layout.
- Template cards arranged in a grid.
- Form and preview side by side when appropriate.
- Preview should remain readable.

### Laptop

1024px:

- Balanced form/preview layout.
- Avoid cramped controls.

### Tablet

768px:

- Stack or adapt columns.
- Template cards use fewer columns.
- Form and preview remain accessible.

### Mobile

375px and above:

- Single-column layout.
- Full-width buttons where appropriate.
- Stack form sections.
- Template cards stack or use compact layouts.
- CV preview must fit without causing application horizontal overflow.
- Touch-friendly controls.
- Readable text.

Do not allow horizontal scrolling in the main application interface.

---

## 16. Project Folder Structure

Create this structure:

bluecv-builder/
│
├── index.html
├── style.css
├── script.js
│
└── assets/
└── sample-avatar.svg

### index.html

Responsibilities:

- Semantic application structure.
- Header.
- Workflow navigation.
- Template selection.
- Form containers.
- Preview containers.
- Dialogs.
- Status and toast regions.
- Linking CSS and JavaScript.

### style.css

Responsibilities:

- Design system.
- Application UI.
- Form styles.
- Template selection cards.
- Preview styles.
- Four CV template designs.
- Responsive layouts.
- Accessibility states.
- Print styles.
- A4 print configuration.

### script.js

Responsibilities:

- Application state.
- Workflow navigation.
- Template selection.
- Dynamic form rendering.
- Form event handling.
- Repeatable sections.
- Sample data.
- Photo upload.
- Validation.
- Preview rendering.
- Template renderers.
- Dialogs.
- Toast notifications.
- Print/PDF workflow.

### assets/sample-avatar.svg

Responsibilities:

- Local profile photo placeholder.
- No external image dependency.

Keep code modular and readable even if JavaScript remains in a single file.

---

## 17. Development Phases

Implement the project in phases. Do not implement everything at once.

### Phase 1 — Project Setup & Design Foundation

Goals:

- Create project structure.
- Build semantic HTML shell.
- Create responsive application layout.
- Implement the blue design system.
- Build header, workflow navigation, template selection shell, form shell, preview shell, dialogs, and status components.
- Create sample-avatar.svg.

Files:

- index.html
- style.css
- script.js
- assets/sample-avatar.svg

Expected outcome:
A polished responsive application foundation with the main UI sections in place.

### Phase 2 — Template Selection & Workflow

Goals:

- Implement all four template selection cards.
- Make cards keyboard-accessible.
- Highlight selected template.
- Implement step navigation.
- Implement Back and Next.
- Implement Change Template.
- Preserve CV state during navigation.

Expected outcome:
Users can select Professional, Modern, Colorful, or Executive and navigate through the workflow.

### Phase 3 — Dynamic CV Form

Goals:

- Personal information.
- Professional summary.
- Work experience.
- Education.
- Skills.
- Projects.
- Certifications.
- Languages.
- Optional sections.
- Add/remove repeatable entries.
- Form validation.
- Event delegation.
- State synchronization.

Expected outcome:
Users can fully enter and edit their CV information.

### Phase 4 — Sample Data & Photo Upload

Goals:

- Implement Fill with Sample Data.
- Add fictional data to all major sections.
- Add replacement confirmation.
- Implement photo upload.
- Validate file type and size.
- Show photo preview.
- Remove or replace photo.
- Handle photo fallback.

Expected outcome:
Users can populate a complete CV instantly or upload their own profile photo.

### Phase 5 — Live Preview & Four Template Renderers

Goals:

- Implement the Professional template.
- Implement the Modern template.
- Implement the Colorful template.
- Implement the Executive template.
- Create shared section rendering helpers.
- Render all supported CV data.
- Hide empty sections.
- Update preview on form changes.
- Support template switching without data loss.
- Handle long content.

Expected outcome:
All four templates are fully functional and visually distinct.

### Phase 6 — PDF & Print Export

Goals:

- Implement print-only CV output.
- Implement A4 portrait sizing.
- Implement 25.4 mm margins.
- Hide application UI.
- Add multi-page print support.
- Add page-break rules.
- Preserve text selection.
- Include photo.
- Add professional filename behavior.
- Add validation before printing.

Expected outcome:
Users can save a clean, professional CV as a PDF through the native print dialog.

### Phase 7 — Responsive QA & Final Polish

Goals:

- Test desktop.
- Test laptop.
- Test tablet.
- Test mobile.
- Fix layout bugs.
- Fix form bugs.
- Fix template issues.
- Fix PDF issues.
- Check keyboard accessibility.
- Verify all buttons.
- Verify all acceptance criteria.

Expected outcome:
A stable, complete, responsive, production-quality static CV Builder.

---

## 18. Implementation Checklist

### Project Setup

- [ ] Create index.html
- [ ] Create style.css
- [ ] Create script.js
- [ ] Create assets/sample-avatar.svg
- [ ] Connect all files
- [ ] Verify local application launch

### UI Foundation

- [ ] Header
- [ ] Logo
- [ ] Main layout
- [ ] Workflow navigation
- [ ] Progress indicator
- [ ] Template selection area
- [ ] Form container
- [ ] Preview container
- [ ] Toast system
- [ ] Confirmation dialog
- [ ] Responsive layout

### Template Selection

- [ ] Professional template card
- [ ] Modern template card
- [ ] Colorful template card
- [ ] Executive template card
- [ ] Template selection state
- [ ] Keyboard interaction
- [ ] Template switching
- [ ] Preserve CV data

### CV Form

- [ ] Personal information
- [ ] Professional summary
- [ ] Work experience
- [ ] Education
- [ ] Skills
- [ ] Projects
- [ ] Certifications
- [ ] Languages
- [ ] Awards
- [ ] Interests
- [ ] References
- [ ] Add repeatable entries
- [ ] Remove repeatable entries
- [ ] Validation
- [ ] State synchronization

### Sample Data

- [ ] Sample data button
- [ ] Fictional profile information
- [ ] Sample work experience
- [ ] Sample education
- [ ] Sample skills
- [ ] Sample projects
- [ ] Sample certifications
- [ ] Sample languages
- [ ] Sample optional sections
- [ ] Replacement confirmation
- [ ] Preview updates

### Profile Photo

- [ ] Upload photo
- [ ] File type validation
- [ ] File size validation
- [ ] Image preview
- [ ] Remove photo
- [ ] Replace photo
- [ ] Fallback avatar
- [ ] Template photo support

### Live Preview

- [ ] Professional renderer
- [ ] Modern renderer
- [ ] Colorful renderer
- [ ] Executive renderer
- [ ] Shared CV data
- [ ] Real-time updates
- [ ] Empty section handling
- [ ] Current employment handling
- [ ] Long content handling
- [ ] Safe text rendering

### PDF Export

- [ ] Download/Save as PDF button
- [ ] Print dialog
- [ ] A4 portrait
- [ ] 1-inch margins
- [ ] 25.4 mm margins
- [ ] Print-only CV
- [ ] Hide application UI
- [ ] Multi-page support
- [ ] Page-break handling
- [ ] Profile photo in print
- [ ] Selectable text
- [ ] Filename generation
- [ ] Empty data validation
- [ ] Verify all four templates

### Responsive Design

- [ ] Desktop
- [ ] Laptop
- [ ] Tablet
- [ ] Mobile
- [ ] No main UI horizontal overflow
- [ ] Touch-friendly controls
- [ ] Readable CV preview
- [ ] Responsive template cards

### Accessibility

- [ ] Semantic HTML
- [ ] Labels
- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Dialog accessibility
- [ ] Status announcements
- [ ] Color contrast
- [ ] Reduced motion

### Testing

- [ ] Template selection
- [ ] Template switching
- [ ] Empty form
- [ ] Sample data
- [ ] Sample replacement confirmation
- [ ] Photo upload
- [ ] Invalid photo
- [ ] Oversized photo
- [ ] Add/remove experience
- [ ] Add/remove education
- [ ] Add/remove project
- [ ] Add/remove certification
- [ ] Add/remove language
- [ ] Add/remove skill
- [ ] Form validation
- [ ] Live preview
- [ ] Long CV content
- [ ] Multi-page PDF
- [ ] A4 output
- [ ] 1-inch margins
- [ ] Mobile responsiveness
- [ ] Keyboard navigation

### Final Review

- [ ] No broken buttons
- [ ] No console errors
- [ ] No unfinished functionality
- [ ] No placeholder features
- [ ] No accidental data loss
- [ ] No external network dependency
- [ ] All templates visually distinct
- [ ] All planned features verified

---

## 19. Testing Plan

### Template Tests

For each template:

- Select template.
- Enter CV data.
- Verify preview layout.
- Switch to another template.
- Verify data preservation.
- Print preview.
- Verify PDF appearance.

### Form Tests

- Enter valid data.
- Enter incomplete data.
- Enter invalid email.
- Enter invalid URL.
- Add multiple entries.
- Remove entries.
- Verify empty entries are hidden.
- Verify state remains intact.

### Sample Data Tests

- Populate empty form.
- Populate partially filled form.
- Confirm replacement dialog.
- Cancel replacement.
- Confirm replacement.
- Verify preview updates.

### Photo Tests

- Upload valid JPG.
- Upload PNG.
- Upload WebP.
- Upload invalid format.
- Upload file over 5 MB.
- Remove image.
- Replace image.
- Verify fallback.

### PDF Tests

- CV with minimal content.
- CV with complete content.
- CV with very long content.
- CV with profile photo.
- All four templates.
- Multiple pages.
- A4 dimensions.
- 25.4 mm margins.
- Text not clipped.
- No UI controls in PDF.
- No unwanted blank pages.
- Selectable text.

### Responsive Tests

- 1440px desktop.
- 1024px laptop.
- 768px tablet.
- 375px mobile.
- Verify no unwanted horizontal overflow.
- Verify all controls remain accessible.

---

## 20. Risks & Solutions

### PDF Layout Differences

Risk:
Browser print engines may render differently.

Solution:
Use native print CSS, avoid fixed heights, test print preview, and prioritize standard CSS layout techniques.

### Multi-Page CV

Risk:
Sections may split awkwardly.

Solution:
Use natural document flow, suitable break-inside rules, and avoid fixed page containers.

### Profile Image

Risk:
Large images may cause memory or layout issues.

Solution:
Validate size, use preview carefully, and keep image handling client-side.

### Dynamic Form Complexity

Risk:
Repeatable sections may produce inconsistent state.

Solution:
Use stable IDs, centralized state, and reusable render/update functions.

### Template CSS Conflicts

Risk:
Template styles may affect each other.

Solution:
Scope styles using unique template classes.

### Data Loss

Risk:
Changing steps or templates may reset form data.

Solution:
Keep a central state object and render UI from that state.

### Print Background Colors

Risk:
Browser settings may omit background graphics.

Solution:
Ensure CV remains readable without background printing; do not depend on background color to communicate important information.

### Browser Compatibility

Risk:
Print behavior and form controls may vary.

Solution:
Use standard browser APIs and test in modern Chromium-based browsers and Firefox where available.

---

## 21. Completion Criteria

The project is considered complete only when:

- [ ] All four templates are implemented.
- [ ] All templates have clearly distinct designs.
- [ ] Template selection works.
- [ ] Template switching preserves data.
- [ ] All form sections work.
- [ ] Repeatable sections work.
- [ ] Sample data works.
- [ ] Photo upload works.
- [ ] Photo removal works.
- [ ] Live preview works.
- [ ] Empty sections are hidden.
- [ ] Form validation works.
- [ ] PDF print flow works.
- [ ] PDF uses A4 portrait.
- [ ] PDF margins are 1 inch on every side.
- [ ] PDF supports multiple pages.
- [ ] Text is selectable.
- [ ] No major clipping or overlapping.
- [ ] Responsive layouts work.
- [ ] Accessibility basics are implemented.
- [ ] No backend or database.
- [ ] No framework.
- [ ] No broken or fake functionality.
- [ ] All critical test cases pass.

---

## 22. AI Development Instructions

The AI developer must follow these instructions throughout implementation:

1. Read this entire plan before starting.
2. Read the original BlueCV Builder project requirements.
3. Implement phases in the listed order.
4. Do not skip features.
5. Do not remove original requirements.
6. Implement all four CV templates.
7. Keep the application framework-free.
8. Do not add a backend or database.
9. Do not introduce unnecessary dependencies.
10. Maintain a clean and modular codebase.
11. Keep CV state centralized.
12. Preserve data when navigating or switching templates.
13. Use safe DOM APIs for user data.
14. Ensure every button performs its intended action.
15. Test each phase before moving to the next.
16. Fix issues before continuing.
17. Update plan.md checkboxes only for completed and verified tasks.
18. Do not claim untested features are complete.
19. Do not replace working features unnecessarily.
20. Stop after each phase and report the results.
21. Wait for the user's approval before starting the next phase.
22. At the end, provide complete setup, usage, and manual testing instructions.

## Final Instruction

Build BlueCV Builder according to this plan.

Prioritize:

- High-quality UI.
- Four distinct CV templates.
- Smooth user experience.
- Accurate CV data handling.
- Reliable print/PDF output.
- Responsive design.
- Accessibility.
- Clean, maintainable Vanilla JavaScript.

Do not compromise functionality for visual appearance.

Do not begin all phases in one pass. Complete one phase, test it, update the plan, report the result, and wait for approval before continuing.
