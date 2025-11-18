---
outline: deep
---

# Filtering in RobotFramework Dashboard

RobotFramework Dashboard provides powerful filtering options to help you analyze your test results efficiently. Filters are available across different pages, and some pages also provide section-specific filters. This guide explains all available filters and options.

## Overview Page

The **Overview** page does not have global filters. However, it offers a few **display settings**:

- **Show Project Names** – Toggle whether to display the names of projects in the statistics.
- **Show Project Tags** – Toggle whether to use custom project tags if defined in your test run metadata.
- **Duration Percentage Threshold** – Adjust the percentage threshold used to color-code durations (faster/slower runs).

> These settings affect only the way the statistics are presented on the Overview page.

## Dashboard Page

The **Dashboard** page provides both **global filters** and **section-specific filters**.  

### Global Filters

Global filters are applied to the entire dashboard, affecting all sections and graphs:

1. **Run**  
   - Filter by the run name.
   - Select from a dropdown of all available runs.

2. **Run Tag**  
   - Filter by test tags associated with runs.
   - Uses **AND/OR logic** to combine multiple tag selections.
   - Multi-select dropdown allows filtering by one or more tags.

3. **Run Date / Time**  
   - Filter by a date and time range.
   - Options include:
     - **From Date / From Time** – Start of the range
     - **To Date / To Time** – End of the range
   - Only runs within this range are displayed.

4. **Run Amount**  
   - After applying other filters, only the last **X runs** are shown.
   - Default: **20** runs.
   - If fewer than X runs exist, only the available runs are shown.
   - The selected amount is displayed in each dashboard section.

5. **Metadata**  
   - Filter runs by **run-level or suite-level metadata**.
   - Metadata filters are applied across the entire run.

### Section Filters on Dashboard

The Dashboard is divided into four sections: **Run, Suite, Test, Keyword**. Each section has specific filtering options.

#### Run Section
- No additional filters specific to this section.

#### Suite Section
- **Folder Filter (Donut Chart)** – Click on folder donuts to "zoom in" on specific suites.
- **Suite Selection Dropdown** – Choose a specific suite or all suites.
- **Full Suite Paths Toggle** – When enabled, shows the full suite path instead of only the suite name.  
  - Useful if there are duplicate suite names in different folders.

#### Test Section
- **Suite Filter** – Select one or multiple suites from a dropdown.
- **Suite Paths Toggle** – Same logic as the Suite section; allows distinguishing duplicate suite names.
- **Test Selection Dropdown** – Zoom in on a specific test.
- **Test Tag Dropdown** – Filter tests by tags.

#### Keyword Section
- **Keyword Dropdown** – Select a specific keyword to zoom in on.
- **Library Names Toggle** – Include library names in the keyword selection dropdown.

## Compare Page

The **Compare** page is designed to compare runs side by side:

- **Run Selection Dropdowns** – Select up to **4 runs** to compare.
- **Suite Paths Toggle** – Apply the full suite path logic to graphs to distinguish duplicate suite names.

> Compare page does not use global filters; it only uses the selected runs and optional suite path toggles.

## Tables Page

The **Tables** page allows for detailed inspection of raw test data:

- **Global Filters** (same as Dashboard page):
  - Run
  - Run Tag
  - Run Date / Time
  - Run Amount
  - Metadata

> These filters let you zoom into specific runs, suites, tests, or keywords, allowing precise analysis of the raw data in the tables.

**Summary:**  

- **Overview:** Display-only settings for projects and duration thresholds.  
- **Dashboard:** Full global filters plus section-specific filters for Runs, Suites, Tests, and Keywords.  
- **Compare:** Select up to 4 runs for side-by-side comparison with optional suite paths toggle.  
- **Tables:** Use global filters to zoom into specific raw data.  

> By combining global filters and section-specific filters, you can quickly focus on the most relevant parts of your test data and identify trends, failures, or performance issues.
