# Accessibility Statement

This document outlines the measures taken to ensure that this Kanban board application is accessible, with a particular focus on users with vision impairments and also users who rely on screen readers.

## Accessibility Features

We have implemented the following features to make our application more accessible:

1.  **Semantic HTML:** The application is built using semantic HTML5 elements to ensure proper structure and meaning.

2.  **ARIA Attributes:** We utilize Accessible Rich Internet Applications (ARIA) attributes to enhance the accessibility of dynamic content and custom controls.

    -   `role` attributes (e.g., `role="region"`) are used to make it easier for screen reader users to navigate.
    -   `aria-label` attributes provide descriptive labels for interactive elements.
    -   `aria-hidden="true"` is used for decorative elements that do not add information for screen reader users.

3.  **Keyboard Navigation:** All interactive elements are reachable and operable using a keyboard.

    -   Users can navigate through elements using the `Tab` key.
    -   Actions can be triggered using the `Enter` or `Space` keys for buttons and other controls.
    -   The `Esc` key can be used to close modals or dropdowns.

4.  **Focus Management:**

    -   Clear visual focus indicators are provided (mainly by tailwaind classes and shadcn/ui) for all interactive elements.
    -   In some cases, `autoFocus` is used to move the focus to relevant input fields.

5.  **Contrast and Readability:** Sufficient color contrast between text and background to aid users with low vision. Text is scalable through browser zoom settings. Easily readable fonts are used, too.

6.  **Screen Reader Compatibility:**
    -   Dynamic updates to the page (e.g., adding a task, loading content, adding a list) are announced to screen readers using `aria-live` regions. For example, we use `aria-live` regions to inform users of (real-time) updates without having them navigate away from their current focus.
