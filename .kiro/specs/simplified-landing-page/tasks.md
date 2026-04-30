# Implementation Plan: Simplified Landing Page

## Overview

This implementation plan converts the simplified landing page design into actionable coding tasks. The approach focuses on establishing the design system foundation first, then systematically updating components to use the new design tokens, typography, and scrolling behavior. Tasks are organized to enable incremental progress with early validation through testing.

## Tasks

- [ ] 1. Set up design system foundation
  - [ ] 1.1 Create CSS custom properties for color palette
    - Define all color variables in a central CSS file (colors: burgundy, deep red, crimson, orange variants, neutrals, semantic colors)
    - Create :root selector with all --color-* custom properties
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
  
  - [ ] 1.2 Import and configure Inter font
    - Add Google Fonts import for Inter font family (weights: 400, 500, 600, 700)
    - Update base body text styles to use Inter font with system font fallbacks
    - _Requirements: 3.2, 3.7_
  
  - [ ] 1.3 Create scrollbar hiding utility styles
    - Implement CSS for hiding scrollbars across browsers (webkit, Firefox, IE/Edge)
    - Add smooth scroll behavior to scrollable containers
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ]* 1.4 Write property test for color palette consistency
    - **Property 5: Color Palette Consistency**
    - **Validates: Requirements 2.7**
  
  - [ ]* 1.5 Write property test for CSS custom properties
    - **Property 6: CSS Custom Properties for Colors**
    - **Validates: Requirements 2.6**

- [ ] 2. Update PageWrapper component
  - [ ] 2.1 Apply scrollbar hiding styles to PageWrapper
    - Add scrollbar hiding CSS classes to the main wrapper
    - Implement smooth scroll behavior
    - Update background color to use CSS variable (--color-burgundy)
    - _Requirements: 1.1, 1.2, 1.3, 2.1_
  
  - [ ]* 2.2 Write property test for scrollbar hiding
    - **Property 1: Scrollbar Hiding with Smooth Scrolling**
    - **Validates: Requirements 1.1, 1.2, 1.3, 6.2, 6.6**
  
  - [ ]* 2.3 Write unit tests for PageWrapper
    - Test component renders with correct CSS classes
    - Test background color uses CSS variable
    - _Requirements: 1.1, 2.1_

- [ ] 3. Migrate color palette across all components
  - [ ] 3.1 Replace hardcoded colors in HeroSection
    - Update all color values to use CSS custom properties
    - Update title/subtitle colors to use --color-orange
    - _Requirements: 2.6, 2.7, 4.2_
  
  - [ ] 3.2 Replace hardcoded colors in ProductsSection
    - Update section background to --color-deep-red
    - Update product card backgrounds to --color-crimson
    - Update button colors to --color-orange with --color-orange-hover for hover states
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ] 3.3 Replace hardcoded colors in AnnouncementsSection
    - Update section background colors to use CSS variables
    - Update category-based color coding to use semantic color variables
    - _Requirements: 2.6, 2.7, 6.7_
  
  - [ ] 3.4 Replace hardcoded colors in OfficersSection
    - Update section background and card colors to use CSS variables
    - Update hover state colors to use --color-orange-hover
    - _Requirements: 2.6, 2.7, 7.6_
  
  - [ ]* 3.5 Write visual regression tests for color changes
    - Capture screenshots at multiple breakpoints
    - Compare color values before/after migration
    - _Requirements: 2.7_

- [ ] 4. Update typography system
  - [ ] 4.1 Update heading typography to use Bebas Neue
    - Apply Bebas Neue font to all h1, h2, h3 elements
    - Update hero title and section title styles
    - Set appropriate letter-spacing (0.02em)
    - _Requirements: 3.1, 3.7_
  
  - [ ] 4.2 Update body text typography to use Inter
    - Apply Inter font to all body text, paragraphs, and spans
    - Ensure fallback to system fonts
    - _Requirements: 3.2, 3.7_
  
  - [ ] 4.3 Implement responsive typography scale
    - Set desktop font sizes (hero: 4.5rem, section titles: 3rem)
    - Add tablet breakpoint styles (hero: 2.5rem, section titles: 2rem)
    - Add mobile breakpoint styles (hero: 1.8rem, section titles: 1.5rem)
    - _Requirements: 3.3, 3.4, 3.5, 3.6_
  
  - [ ]* 4.4 Write property tests for typography system
    - **Property 2: Typography System for Headings**
    - **Property 3: Typography System for Body Text**
    - **Property 4: Font Fallback Chain**
    - **Validates: Requirements 3.1, 3.2, 3.7**
  
  - [ ]* 4.5 Write unit tests for responsive typography
    - Test font sizes at different breakpoints
    - Test font family application
    - _Requirements: 3.3, 3.4, 3.5, 3.6_

- [ ] 5. Checkpoint - Verify design system implementation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Update HeroSection component
  - [ ] 6.1 Implement hero slideshow with proper timing
    - Ensure 6 images rotate on 30-second cycle
    - Apply smooth CSS transitions between slides
    - _Requirements: 4.1, 4.6_
  
  - [ ] 6.2 Update hero content overlay
    - Display title, subtitle, and description with new typography
    - Apply proper color variables for text
    - _Requirements: 4.2_
  
  - [ ] 6.3 Implement responsive hero heights
    - Set 70vh for desktop, 50vh for tablet, 45vh for mobile
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ]* 6.4 Write property tests for HeroSection
    - **Property 7: Hero Section Content Display**
    - **Property 8: Hero Slideshow Transitions**
    - **Validates: Requirements 4.2, 4.6**
  
  - [ ]* 6.5 Write unit tests for hero responsive behavior
    - Test height values at different breakpoints
    - Test slideshow timing
    - _Requirements: 4.3, 4.4, 4.5_

- [ ] 7. Update ProductsSection component
  - [ ] 7.1 Implement responsive grid layout
    - Use CSS Grid with auto-fill and minmax(320px, 1fr)
    - Ensure proper spacing between cards
    - _Requirements: 5.1, 5.2_
  
  - [ ] 7.2 Implement stock status badges
    - Add low stock badge when stockAvailable < threshold
    - Add out of stock badge when stockAvailable = 0
    - Apply appropriate semantic colors (warning, error)
    - _Requirements: 5.3, 5.4_
  
  - [ ] 7.3 Implement product card hover effects
    - Add CSS hover states with transform and color transitions
    - Use --color-orange-hover for button hover states
    - _Requirements: 5.5_
  
  - [ ] 7.4 Implement loading and empty states
    - Create loading spinner component
    - Create empty state message component
    - _Requirements: 5.6, 5.7, 11.4_
  
  - [ ] 7.5 Implement image error handling
    - Add onError handler to replace failed images with fallback
    - Validate image URLs before rendering
    - _Requirements: 9.1, 9.5_
  
  - [ ]* 7.6 Write property tests for ProductsSection
    - **Property 9: Grid Layout for Sections**
    - **Property 10: Stock Status Badge Display**
    - **Property 11: Out of Stock Badge Display**
    - **Property 12: Interactive Element Hover Effects**
    - **Property 20: Image Loading Fallback**
    - **Validates: Requirements 5.1, 5.3, 5.4, 5.5, 9.1**
  
  - [ ]* 7.7 Write unit tests for product cards
    - Test stock badge rendering logic
    - Test hover effects
    - Test image fallback behavior
    - _Requirements: 5.3, 5.4, 5.5, 9.1_

- [ ] 8. Update AnnouncementsSection component
  - [ ] 8.1 Implement horizontal scrollable slider
    - Create horizontal scroll container with hidden scrollbar
    - Set fixed card height (600px)
    - Apply smooth scroll behavior
    - _Requirements: 6.1, 6.2, 6.3, 6.6_
  
  - [ ] 8.2 Implement slider navigation controls
    - Add next/previous buttons
    - Implement scroll by 320px on button click
    - Use smooth scroll animation
    - _Requirements: 6.4, 6.6_
  
  - [ ] 8.3 Implement announcement expansion
    - Add click handler to toggle expanded state
    - Show/hide full description on expansion
    - _Requirements: 6.5_
  
  - [ ] 8.4 Implement category-based color coding
    - Map announcement categories to color variables
    - Apply category colors to card borders or backgrounds
    - _Requirements: 6.7_
  
  - [ ]* 8.5 Write property tests for AnnouncementsSection
    - **Property 13: Announcements Slider Navigation**
    - **Property 14: Announcement Expansion**
    - **Property 15: Category-Based Color Coding**
    - **Validates: Requirements 6.4, 6.5, 6.6, 6.7**
  
  - [ ]* 8.6 Write unit tests for announcements slider
    - Test navigation button functionality
    - Test expansion toggle
    - Test category color mapping
    - _Requirements: 6.4, 6.5, 6.7_

- [ ] 9. Update OfficersSection component
  - [ ] 9.1 Implement responsive grid layout
    - Use CSS Grid with auto-fit and minmax(220px, 1fr)
    - Ensure proper spacing between cards
    - _Requirements: 7.1, 7.2_
  
  - [ ] 9.2 Implement circular profile images
    - Apply border-radius: 50% to officer images
    - Ensure images are square before applying border-radius
    - _Requirements: 7.3_
  
  - [ ] 9.3 Implement social media icons
    - Display clickable icons for Facebook, Twitter, Instagram
    - Only show icons when links are provided
    - Validate social media URLs
    - _Requirements: 7.4, 12.3_
  
  - [ ] 9.4 Implement officer position sorting
    - Sort officers array by position before rendering
    - _Requirements: 7.5_
  
  - [ ] 9.5 Implement hover effects
    - Add CSS hover states with transform and color transitions
    - _Requirements: 7.6_
  
  - [ ]* 9.6 Write property tests for OfficersSection
    - **Property 16: Circular Officer Images**
    - **Property 17: Social Media Icons Display**
    - **Property 18: Officer Position Sorting**
    - **Property 32: Social Media Link Validation**
    - **Validates: Requirements 7.3, 7.4, 7.5, 12.3**
  
  - [ ]* 9.7 Write unit tests for officer cards
    - Test circular image styling
    - Test social media icon rendering
    - Test position sorting logic
    - _Requirements: 7.3, 7.4, 7.5_

- [ ] 10. Checkpoint - Verify component updates
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement responsive layout system
  - [ ] 11.1 Define responsive breakpoints
    - Create breakpoint constants (320px, 480px, 640px, 768px, 1024px, 1440px)
    - _Requirements: 8.1_
  
  - [ ] 11.2 Implement responsive section padding
    - Apply 5rem padding for desktop
    - Apply 3rem padding for tablet
    - Apply 2rem padding for mobile
    - _Requirements: 8.4_
  
  - [ ] 11.3 Prevent horizontal overflow
    - Add overflow-x: hidden to body and main containers
    - Ensure all components respect viewport width
    - _Requirements: 8.3_
  
  - [ ] 11.4 Ensure interactive element accessibility
    - Verify all buttons and links are accessible at all breakpoints
    - Ensure minimum touch target size (44x44px) on mobile
    - _Requirements: 8.5_
  
  - [ ]* 11.5 Write property test for responsive layout
    - **Property 19: Responsive Layout Adaptation**
    - **Validates: Requirements 8.2, 8.3**
  
  - [ ]* 11.6 Write visual regression tests for responsive design
    - Capture screenshots at all breakpoints
    - Verify no horizontal overflow
    - _Requirements: 8.2, 8.3_

- [ ] 12. Implement image optimization
  - [ ] 12.1 Implement lazy loading for images
    - Add loading="lazy" attribute to product images
    - Add loading="lazy" to officer images
    - Add loading="lazy" to announcement images
    - _Requirements: 9.2_
  
  - [ ] 12.2 Implement responsive image sizing
    - Use appropriate image sizes for different breakpoints
    - Apply srcset for responsive images where applicable
    - _Requirements: 9.3_
  
  - [ ] 12.3 Implement progressive loading for hero slideshow
    - Load hero images with progressive enhancement
    - Show placeholder while images load
    - _Requirements: 9.4_
  
  - [ ]* 12.4 Write property tests for image handling
    - **Property 21: Lazy Loading for Images**
    - **Property 22: Responsive Image Sizing**
    - **Property 23: Image URL Validation**
    - **Validates: Requirements 9.2, 9.3, 9.5**
  
  - [ ]* 12.5 Write unit tests for image optimization
    - Test lazy loading attribute application
    - Test image URL validation
    - _Requirements: 9.2, 9.5_

- [ ] 13. Implement performance optimizations
  - [ ] 13.1 Use CSS transforms for animations
    - Replace position-based animations with transform
    - Apply transform: translateZ(0) for hardware acceleration
    - _Requirements: 10.1, 10.2_
  
  - [ ] 13.2 Implement debounced scroll handlers
    - Create debounce utility function
    - Wrap scroll event listeners with debounce
    - _Requirements: 10.3_
  
  - [ ] 13.3 Optimize animation performance
    - Add will-change property to animated elements
    - Limit simultaneous animations
    - Use animation-fill-mode: forwards
    - _Requirements: 10.4_
  
  - [ ]* 13.4 Write property tests for performance optimizations
    - **Property 24: CSS Transform Animations**
    - **Property 25: Hardware Acceleration**
    - **Property 26: Debounced Scroll Handlers**
    - **Validates: Requirements 10.1, 10.2, 10.3**
  
  - [ ]* 13.5 Write performance tests
    - Test scroll performance with debouncing
    - Test animation frame rates
    - _Requirements: 10.3, 10.4_

- [ ] 14. Implement data integration and error handling
  - [ ] 14.1 Implement Firebase data fetching
    - Fetch products from Firestore products collection
    - Fetch announcements from Firestore announcements collection
    - Fetch officers from Firestore officers collection
    - _Requirements: 11.1, 11.2, 11.3_
  
  - [ ] 14.2 Implement loading states
    - Show loading indicators during data fetch
    - Apply loading states to each section independently
    - _Requirements: 11.4_
  
  - [ ] 14.3 Implement error handling
    - Display error messages for Firebase connection failures
    - Provide retry mechanisms for failed requests
    - _Requirements: 11.5_
  
  - [ ] 14.4 Implement data validation
    - Validate data structure against TypeScript interfaces
    - Handle malformed data gracefully
    - _Requirements: 11.6_
  
  - [ ]* 14.5 Write property tests for data integration
    - **Property 27: Loading State Display**
    - **Property 28: Firebase Error Handling**
    - **Property 29: Data Structure Validation**
    - **Validates: Requirements 11.4, 11.5, 11.6**
  
  - [ ]* 14.6 Write integration tests for Firebase
    - Test data fetching with mock Firebase
    - Test error handling scenarios
    - Test data validation
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6_

- [ ] 15. Implement content security measures
  - [ ] 15.1 Implement content sanitization
    - Sanitize user-generated content from Firebase
    - Escape HTML in announcement descriptions
    - Use React's built-in XSS protection
    - _Requirements: 12.1, 12.4_
  
  - [ ] 15.2 Implement base64 image validation
    - Validate base64 image data format
    - Check for proper image headers
    - _Requirements: 12.2_
  
  - [ ] 15.3 Implement URL validation
    - Validate social media URLs
    - Validate image URLs
    - Restrict external sources to trusted domains
    - _Requirements: 12.3, 12.5_
  
  - [ ]* 15.4 Write property tests for content security
    - **Property 30: Content Sanitization**
    - **Property 31: Base64 Image Validation**
    - **Property 33: HTML Escaping in Descriptions**
    - **Property 34: Trusted Domain Restriction**
    - **Validates: Requirements 12.1, 12.2, 12.4, 12.5**
  
  - [ ]* 15.5 Write security tests
    - Test XSS prevention
    - Test URL validation
    - Test content sanitization
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 16. Implement browser compatibility
  - [ ] 16.1 Test scrollbar hiding across browsers
    - Verify webkit-scrollbar works in Chrome/Safari
    - Verify scrollbar-width works in Firefox
    - Verify ms-overflow-style works in IE/Edge
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [ ] 16.2 Test smooth scroll behavior
    - Verify smooth scroll works across all browsers
    - Implement fallback for browsers without smooth scroll support
    - _Requirements: 13.4_
  
  - [ ] 16.3 Verify CSS Grid support
    - Test grid layouts in all major browsers
    - Implement fallback for older browsers if needed
    - _Requirements: 13.5_
  
  - [ ]* 16.4 Write cross-browser compatibility tests
    - Test in Chrome, Firefox, Safari, Edge
    - Verify scrollbar hiding
    - Verify smooth scroll
    - Verify grid layouts
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 17. Final integration and wiring
  - [ ] 17.1 Wire all components together
    - Ensure all components use the design system
    - Verify all color variables are applied
    - Verify all typography styles are applied
    - Verify all scrollbar hiding is applied
    - _Requirements: All requirements_
  
  - [ ] 17.2 Verify end-to-end functionality
    - Test complete user flow from hero to footer
    - Verify all interactions work correctly
    - Verify responsive behavior at all breakpoints
    - _Requirements: All requirements_
  
  - [ ]* 17.3 Write end-to-end integration tests
    - Test complete page rendering
    - Test all user interactions
    - Test responsive behavior
    - _Requirements: All requirements_

- [ ] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The design system foundation (Task 1) must be completed before component updates
- Color palette migration (Task 3) should be completed before visual testing
- Performance optimizations (Task 13) can be implemented incrementally alongside component updates
